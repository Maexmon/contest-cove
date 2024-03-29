// routes
import { Routes } from "@angular/router";

// components
import { HomeComponent } from "./home/home.component";
import { ContestNewComponent } from "./contest-new/contest-new.component";
import { ContestListComponent } from "./contest-list/contest-list.component";
import { ContestDetailComponent } from "./contest-detail/contest-detail.component";
import { ProfileComponent } from "./profile/profile.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignInComponent } from "./sign-in/sign-in.component";

// guards
import { authGuard } from "./auth.guard";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";

export const routes: Routes = [
    {
        title: "Home | Contest Cove",
        path: "",
        component: HomeComponent,
        canActivate: [authGuard],
    },
    {
        title: "Contests | Contest Cove",
        path: "contests",
        component: ContestListComponent,
        canActivate: [authGuard],
    },
    {
        title: "Create Contest | Contest Cove",
        path: "contests/create",
        component: ContestNewComponent,
        canActivate: [authGuard],
    },
    {
        title: "Contests | Contest Cove",
        path: "contests/:contestId",
        component: ContestDetailComponent,
        canActivate: [authGuard],
    },
    {
        title: "Leaderboard | Contest Cove",
        path: "leaderboard",
        component: LeaderboardComponent,
        canActivate: [authGuard],
    },
    {
        title: "Profile | Contest Cove",
        path: "profile",
        component: ProfileComponent,
        canActivate: [authGuard],
    },
    {
        title: "Sign-Up | Contest Cove",
        path: "sign-up",
        component: SignUpComponent,
    },
    {
        title: "Sign-In | Contest Cove",
        path: "sign-in",
        component: SignInComponent,
    },
];
