import {
  SETTINGS_NAME_REGEX,
  SETTINGS_SCREEN_NAME_REGEX,
  SETTINGS_USER_ID_REGEX,
  TWITTER_API_BASE,
} from './twitter-client-constants.js';
import { buildFollowingFeatures } from './twitter-client-features.js';
import {
  extractCursorFromInstructions,
  parseUsersFromInstructions,
  type TimelineInstruction,
} from './twitter-client-utils.js';
import type {
  CurrentUser,
  CurrentUserResult,
  TwitterClientBase,
  TwitterJsonHeaders,
} from './twitter-client-base.js';

type Constructor<T = object> = abstract new (...args: any[]) => T;

interface RestUserRecord {
  id_str?: string;
  id?: string | number;
  screen_name?: string;
  name?: string;
  description?: string;
  followers_count?: number;
  friends_count?: number;
  verified?: boolean;
  profile_image_url_https?: string;
  created_at?: string;
}

interface RestUsersResponse {
  users?: RestUserRecord[];
  next_cursor_str?: string;
}

interface GraphQlErrorRecord {
  message?: string;
}

interface GraphQlUsersResponse {
  errors?: GraphQlErrorRecord[];
  data?: {
    user?: {
      result?: {
        timeline?: {
          timeline?: {
            instructions?: TimelineInstruction[];
          };
        };
      };
    };
  };
}

interface CurrentUserPayload {
  screen_name?: string;
  name?: string;
  user_id?: string;
  user_id_str?: string;
  user?: {
    screen_name?: string;
    name?: string;
    id?: string;
    id_str?: string;
  };
}

export interface TwitterUserProfile {
  id: string;
  username: string;
  name: string;
  description?: string;
  followersCount?: number;
  followingCount?: number;
  isBlueVerified?: boolean;
  profileImageUrl?: string;
  createdAt?: string;
}

export interface UserListSuccessResult {
  success: true;
  users: TwitterUserProfile[];
  nextCursor?: string;
}

export interface UserListFailureResult {
  success: false;
  error: string;
}

type UserListResult = UserListSuccessResult | UserListFailureResult;

interface GraphQlUserListAttemptSuccess {
  success: true;
  users: TwitterUserProfile[];
  nextCursor?: string;
  had404: boolean;
}

interface GraphQlUserListAttemptFailure {
  success: false;
  error: string;
  had404: boolean;
}

type GraphQlUserListAttemptResult =
  | GraphQlUserListAttemptSuccess
  | GraphQlUserListAttemptFailure;

interface UsersCapable {
  getQueryId(operationName: 'Following' | 'Followers'): Promise<string>;
  fetchWithTimeout(url: string, init?: RequestInit): Promise<Response>;
  getHeaders(): TwitterJsonHeaders;
  withRefreshedQueryIdsOn404<TAttemptResult extends { success?: boolean; had404?: boolean }>(
    attempt: () => Promise<TAttemptResult>,
  ): Promise<{ result: TAttemptResult; refreshed: boolean }>;
  cookieHeader: string;
  userAgent: string;
  clientUserId?: string;
}

function normalizeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function parseNextCursor(value: unknown): string | undefined {
  return typeof value === 'string' && value !== '0' ? value : undefined;
}

function parseUserProfileFromRestRecord(user: RestUserRecord): TwitterUserProfile | null {
  const id =
    typeof user.id_str === 'string'
      ? user.id_str
      : typeof user.id === 'number'
        ? String(user.id)
        : typeof user.id === 'string'
          ? user.id
          : null;
  const username = typeof user.screen_name === 'string' ? user.screen_name : null;

  if (!id || !username) {
    return null;
  }

  return {
    id,
    username,
    name: typeof user.name === 'string' && user.name.length > 0 ? user.name : username,
    description: typeof user.description === 'string' ? user.description : undefined,
    followersCount: typeof user.followers_count === 'number' ? user.followers_count : undefined,
    followingCount: typeof user.friends_count === 'number' ? user.friends_count : undefined,
    isBlueVerified: typeof user.verified === 'boolean' ? user.verified : undefined,
    profileImageUrl:
      typeof user.profile_image_url_https === 'string' ? user.profile_image_url_https : undefined,
    createdAt: typeof user.created_at === 'string' ? user.created_at : undefined,
  };
}

function parseGraphQlErrors(payload: GraphQlUsersResponse): string | null {
  if (!Array.isArray(payload.errors) || payload.errors.length === 0) {
    return null;
  }

  const messages = payload.errors
    .map((entry) => (typeof entry?.message === 'string' ? entry.message : null))
    .filter((message): message is string => Boolean(message));

  return messages.length > 0 ? messages.join(', ') : 'Twitter returned GraphQL errors';
}

function parseCurrentUserFromPayload(payload: unknown): CurrentUser | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const data = payload as CurrentUserPayload;
  const username =
    typeof data.screen_name === 'string'
      ? data.screen_name
      : typeof data.user?.screen_name === 'string'
        ? data.user.screen_name
        : null;
  const name =
    typeof data.name === 'string'
      ? data.name
      : typeof data.user?.name === 'string'
        ? data.user.name
        : username;
  const userId =
    typeof data.user_id === 'string'
      ? data.user_id
      : typeof data.user_id_str === 'string'
        ? data.user_id_str
        : typeof data.user?.id_str === 'string'
          ? data.user.id_str
          : typeof data.user?.id === 'string'
            ? data.user.id
            : null;

  if (!username || !userId) {
    return null;
  }

  return {
    id: userId,
    username,
    name: name || username,
  };
}

function toHeadersInit(headers: TwitterJsonHeaders): HeadersInit {
  return Object.entries(headers);
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

async function fetchUsersViaRest(
  client: UsersCapable,
  urls: string[],
): Promise<UserListResult> {
  let lastError: string | undefined;

  for (const url of urls) {
    try {
      const response = await client.fetchWithTimeout(url, {
        method: 'GET',
        headers: toHeadersInit(client.getHeaders()),
      });

      if (!response.ok) {
        const text = await response.text();
        lastError = `HTTP ${response.status}: ${text.slice(0, 200)}`;
        continue;
      }

      const data = await parseJsonResponse<RestUsersResponse>(response);
      const users = (data.users ?? [])
        .map(parseUserProfileFromRestRecord)
        .filter((user): user is TwitterUserProfile => user !== null);

      return {
        success: true,
        users,
        nextCursor: parseNextCursor(data.next_cursor_str),
      };
    } catch (error) {
      lastError = normalizeError(error);
    }
  }

  return {
    success: false,
    error: lastError ?? 'Unknown error fetching users',
  };
}

async function fetchUsersViaGraphQl(
  client: UsersCapable,
  operationName: 'Following' | 'Followers',
  queryIds: string[],
  params: URLSearchParams,
): Promise<GraphQlUserListAttemptResult> {
  let lastError: string | undefined;
  let had404 = false;

  for (const queryId of queryIds) {
    const url = `${TWITTER_API_BASE}/${queryId}/${operationName}?${params.toString()}`;

    try {
      const response = await client.fetchWithTimeout(url, {
        method: 'GET',
        headers: toHeadersInit(client.getHeaders()),
      });

      if (response.status === 404) {
        had404 = true;
        lastError = `HTTP ${response.status}`;
        continue;
      }

      if (!response.ok) {
        const text = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${text.slice(0, 200)}`,
          had404,
        };
      }

      const data = await parseJsonResponse<GraphQlUsersResponse>(response);
      const graphQlError = parseGraphQlErrors(data);
      if (graphQlError) {
        return { success: false, error: graphQlError, had404 };
      }

      const instructions = data.data?.user?.result?.timeline?.timeline?.instructions;
      return {
        success: true,
        users: parseUsersFromInstructions(instructions) as TwitterUserProfile[],
        nextCursor: extractCursorFromInstructions(instructions),
        had404,
      };
    } catch (error) {
      lastError = normalizeError(error);
    }
  }

  return {
    success: false,
    error: lastError ?? `Unknown error fetching ${operationName.toLowerCase()}`,
    had404,
  };
}

function buildUserListParams(userId: string, count: number, cursor?: string): URLSearchParams {
  const variables: {
    userId: string;
    count: number;
    includePromotedContent: false;
    cursor?: string;
  } = {
    userId,
    count,
    includePromotedContent: false,
  };

  if (cursor) {
    variables.cursor = cursor;
  }

  return new URLSearchParams({
    variables: JSON.stringify(variables),
    features: JSON.stringify(buildFollowingFeatures()),
  });
}

export function withUsers<TBase extends Constructor<UsersCapable>>(Base: TBase) {
  abstract class TwitterClientUsers extends Base {
    async getFollowingQueryIds(): Promise<string[]> {
      const primary = await this.getQueryId('Following');
      return Array.from(new Set([primary, 'BEkNpEt5pNETESoqMsTEGA']));
    }

    async getFollowersQueryIds(): Promise<string[]> {
      const primary = await this.getQueryId('Followers');
      return Array.from(new Set([primary, 'kuFUYP9eV1FPoEy4N-pi7w']));
    }

    parseUsersFromRestResponse(users?: RestUserRecord[]): TwitterUserProfile[] {
      return (users ?? [])
        .map(parseUserProfileFromRestRecord)
        .filter((user): user is TwitterUserProfile => user !== null);
    }

    async getFollowersViaRest(
      userId: string,
      count: number,
      cursor?: string,
    ): Promise<UserListResult> {
      const params = new URLSearchParams({
        user_id: userId,
        count: String(count),
        skip_status: 'true',
        include_user_entities: 'false',
      });

      if (cursor) {
        params.set('cursor', cursor);
      }

      return fetchUsersViaRest(this, [
        `https://x.com/i/api/1.1/followers/list.json?${params.toString()}`,
        `https://api.twitter.com/1.1/followers/list.json?${params.toString()}`,
      ]);
    }

    async getFollowingViaRest(
      userId: string,
      count: number,
      cursor?: string,
    ): Promise<UserListResult> {
      const params = new URLSearchParams({
        user_id: userId,
        count: String(count),
        skip_status: 'true',
        include_user_entities: 'false',
      });

      if (cursor) {
        params.set('cursor', cursor);
      }

      return fetchUsersViaRest(this, [
        `https://x.com/i/api/1.1/friends/list.json?${params.toString()}`,
        `https://api.twitter.com/1.1/friends/list.json?${params.toString()}`,
      ]);
    }

    async getCurrentUser(): Promise<CurrentUserResult> {
      const candidateUrls = [
        'https://x.com/i/api/account/settings.json',
        'https://api.twitter.com/1.1/account/settings.json',
        'https://x.com/i/api/account/verify_credentials.json?skip_status=true&include_entities=false',
        'https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true&include_entities=false',
      ] as const;
      let lastError: string | undefined;

      for (const url of candidateUrls) {
        try {
          const response = await this.fetchWithTimeout(url, {
            method: 'GET',
            headers: toHeadersInit(this.getHeaders()),
          });

          if (!response.ok) {
            const text = await response.text();
            lastError = `HTTP ${response.status}: ${text.slice(0, 200)}`;
            continue;
          }

          const currentUser = parseCurrentUserFromPayload(await response.json());
          if (currentUser) {
            this.clientUserId = currentUser.id;
            return {
              success: true,
              user: currentUser,
            };
          }

          lastError = 'Could not determine current user from response';
        } catch (error) {
          lastError = normalizeError(error);
        }
      }

      const profilePages = ['https://x.com/settings/account', 'https://twitter.com/settings/account'] as const;
      for (const page of profilePages) {
        try {
          const response = await this.fetchWithTimeout(page, {
            headers: {
              cookie: this.cookieHeader,
              'user-agent': this.userAgent,
            },
          });

          if (!response.ok) {
            lastError = `HTTP ${response.status} (settings page)`;
            continue;
          }

          const html = await response.text();
          const username = SETTINGS_SCREEN_NAME_REGEX.exec(html)?.[1];
          const userId = SETTINGS_USER_ID_REGEX.exec(html)?.[1];
          const name = SETTINGS_NAME_REGEX.exec(html)?.[1]?.replace(/\\"/g, '"');

          if (username && userId) {
            this.clientUserId = userId;
            return {
              success: true,
              user: {
                id: userId,
                username,
                name: name || username,
              },
            };
          }

          lastError = 'Could not parse settings page for user info';
        } catch (error) {
          lastError = normalizeError(error);
        }
      }

      return {
        success: false,
        error: lastError ?? 'Unknown error fetching current user',
      };
    }

    async getFollowing(userId: string, count = 20, cursor?: string): Promise<UserListResult> {
      const params = buildUserListParams(userId, count, cursor);
      const tryOnce = async (): Promise<GraphQlUserListAttemptResult> =>
        fetchUsersViaGraphQl(this, 'Following', await this.getFollowingQueryIds(), params);

      const { result, refreshed } = await this.withRefreshedQueryIdsOn404(tryOnce);
      if (result.success) {
        return { success: true, users: result.users, nextCursor: result.nextCursor };
      }

      if (refreshed) {
        const restAttempt = await this.getFollowingViaRest(userId, count, cursor);
        if (restAttempt.success) {
          return restAttempt;
        }
      }

      return { success: false, error: 'error' in result ? result.error : 'Unknown error fetching following' };
    }

    async getFollowers(userId: string, count = 20, cursor?: string): Promise<UserListResult> {
      const params = buildUserListParams(userId, count, cursor);
      const tryOnce = async (): Promise<GraphQlUserListAttemptResult> =>
        fetchUsersViaGraphQl(this, 'Followers', await this.getFollowersQueryIds(), params);

      const { result, refreshed } = await this.withRefreshedQueryIdsOn404(tryOnce);
      if (result.success) {
        return { success: true, users: result.users, nextCursor: result.nextCursor };
      }

      if (refreshed) {
        const restAttempt = await this.getFollowersViaRest(userId, count, cursor);
        if (restAttempt.success) {
          return restAttempt;
        }
      }

      return { success: false, error: 'error' in result ? result.error : 'Unknown error fetching followers' };
    }
  }

  return TwitterClientUsers;
}
