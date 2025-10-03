import { queryOptions } from "@tanstack/react-query";
import { AuthenticationUtilities } from "./AuthenticationUtilities";

export class QueryUtilities {
    static createGetUserInfoQueryOptions(userId: string | undefined  ) {
        return queryOptions({
            queryKey: ['userinfo', userId],
            queryFn: AuthenticationUtilities.getUserInfo,
            enabled: !!userId,
            staleTime: 1000 * 60 * 5, // 5 minutes
        });
    }
}
