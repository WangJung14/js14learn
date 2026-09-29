import { ActivityService } from './activity.service';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    getGroupActivity(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.ActivityType;
        message: string;
    })[]>;
    getMyActivity(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.ActivityType;
        message: string;
    })[]>;
}
