import { Creator } from "app/services/responses/projects/Creator";
import { Reward } from "app/services/responses/projects/Reward";
import { Backer } from "app/services/responses/projects/Backer";
import { Progress } from "app/services/responses/projects/Progress";

export interface Project {
    id: number;
    creationDate: number;
    open: boolean;
    title: string;
    subtitle: string;
    description: string;
    target: number;
    imageUri: string;

    creators: Creator[];
    rewards: Reward[];
    progress: Progress;
    backers: Backer[];
}