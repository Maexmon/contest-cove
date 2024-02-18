// basic component
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

// router
import { ActivatedRoute } from "@angular/router";

// services
import { SharedDataService } from "../internal-services/shared-data.service";
import { SocketService } from "../http-services/socket.service";
import { ContestDetailService } from "../http-services/contest-detail.service";
import { ContestAttendeeListService } from "../http-services/contest-attendee-list.service";
import { ContestObjectiveListService } from "../http-services/contest-objective-list.service";
import { ContestAttendeeEntryNewService } from "../http-services/contest-attendee-entry-new.service";
import { ContestAttendeeEntryListService } from "../http-services/contest-attendee-entry-list.service";
import { ContestTeamsNewService } from "../http-services/contest-teams-new.service";
import { ContestTeamListService } from "../http-services/contest-team-list.service";

// interfaces
import { ContestDetailResponse } from "../interfaces/contest-detail-response";
import { ContestAttendeeListResponse } from "../interfaces/contest-attendee-list-response";
import { ContestObjectiveListResponse } from "../interfaces/contest-objective-list-response";
import { ContestAttendeeEntryNewRequest } from "../interfaces/contest-attendee-entry-new-request";
import { ContestAttendeeEntryNewResponse } from "../interfaces/contest-attendee-entry-new-response";
import { ContestAttendeeEntryListResponse } from "../interfaces/contest-attendee-entry-list-response";
import { ContestTeamsNewRequest } from "../interfaces/contest-teams-new-request";
import { ContestTeamsNewResponse } from "../interfaces/contest-teams-new-response";
import { ContestTeamListResponse } from "../interfaces/contest-team-list-response";

@Component({
    selector: "app-contest-detail",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./contest-detail.component.html",
    styleUrl: "./contest-detail.component.css",
})
export class ContestDetailComponent {
    contestDetailResponseBody: ContestDetailResponse;
    contestAttendeeListResponseBody: ContestAttendeeListResponse;
    contestObjectiveListResponseBody: ContestObjectiveListResponse;
    contestAttendeeEntryNewResponseBody: ContestAttendeeEntryNewResponse;
    contestAttendeeEntryListResponseBody: ContestAttendeeEntryListResponse;
    contestTeamListResponseBody: ContestTeamListResponse;
    contestTeamsNewResponseBody: ContestTeamsNewResponse;

    loadingAttendees: boolean;
    loadingObjectives: boolean;
    loadingEntries: boolean;
    loadingTeams: boolean;

    contestId: string;
    userId: string;

    sortedAttendees: any[][] = [];

    entryValues: number[] = [];
    overallEntrySum: number = 0;

    teamSizes: number[] = [];
    overallSizeSum: number = 0;

    isSocketConnected: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private sharedDataService: SharedDataService,
        private socketService: SocketService,
        private contestDetailService: ContestDetailService,
        private contestAttendeeListService: ContestAttendeeListService,
        private contestObjectiveListService: ContestObjectiveListService,
        private contestAttendeeEntryNewService: ContestAttendeeEntryNewService,
        private contestAttendeeEntryListService: ContestAttendeeEntryListService,
        private contestTeamsNewService: ContestTeamsNewService,
        private contestTeamListService: ContestTeamListService
    ) {}

    ngOnInit() {
        this.contestId = this.route.snapshot.paramMap.get("contestId") || "";

        this.loadingAttendees = true;
        this.loadingObjectives = true;
        this.loadingEntries = true;
        this.loadingTeams = true;

        // connect to web-socket
        this.socketService.connect().subscribe(
            (message) => {
                let parsedMessage = JSON.parse(JSON.stringify(message));

                if (parsedMessage.event === "socket-connect") {
                    this.isSocketConnected = true;
                }

                if (parsedMessage.event === "contest-attendee-entry-new" || parsedMessage.event === "contest-update") {
                    // get contest attendee entries
                    this.loadingEntries = true;
                    this.contestAttendeeEntryListService.listContestAttendeeEntries(this.contestId).subscribe(
                        (contestAttendeeEntryListResponse) => {
                            this.contestAttendeeEntryListResponseBody = contestAttendeeEntryListResponse.body!;

                            this.loadingEntries = false;
                        },
                        (error) => {
                            if (error.status === 404) {
                            }

                            this.loadingEntries = false;
                        }
                    );

                    // get contest details
                    this.contestDetailService.viewContest(this.contestId).subscribe(
                        (contestDetailResponse) => {
                            this.contestDetailResponseBody = contestDetailResponse.body!;

                            // get attendee list
                            this.loadingAttendees = true;
                            this.contestAttendeeListService.listContestAttendees(this.contestId).subscribe(
                                (contestAttendeeListResponse) => {
                                    this.contestAttendeeListResponseBody = contestAttendeeListResponse.body!;

                                    this.sortContestAttendees(
                                        this.contestAttendeeListResponseBody.data.attendees,
                                        this.contestDetailResponseBody.data.currentRound
                                    );

                                    this.loadingAttendees = false;
                                },
                                (error) => {
                                    if (error.status === 404) {
                                    }

                                    this.loadingAttendees = false;
                                }
                            );
                        },
                        (error) => {
                            if (error.status === 404) {
                            }
                        }
                    );
                }
            },
            (error) => {},
            () => {
                this.isSocketConnected = false;
            }
        );

        // get userId
        this.sharedDataService.getCookieUserId().subscribe((userId) => {
            this.userId = userId;

            // get contest details
            this.contestDetailService.viewContest(this.contestId).subscribe(
                (contestDetailResponse) => {
                    this.contestDetailResponseBody = contestDetailResponse.body!;

                    // get attendee list
                    this.contestAttendeeListService.listContestAttendees(this.contestId).subscribe(
                        (contestAttendeeListResponse) => {
                            this.contestAttendeeListResponseBody = contestAttendeeListResponse.body!;

                            this.sortContestAttendees(
                                this.contestAttendeeListResponseBody.data.attendees,
                                this.contestDetailResponseBody.data.currentRound
                            );

                            this.loadingAttendees = false;

                            // get team list
                            this.contestTeamListService.listContestTeams(this.contestId).subscribe(
                                (contestTeamListResponse) => {
                                    this.contestTeamListResponseBody = contestTeamListResponse.body!;

                                    this.loadingTeams = false;
                                },
                                (error) => {
                                    this.loadingTeams = false;
                                }
                            );
                        },
                        (error) => {
                            if (error.status === 404) {
                            }

                            this.loadingAttendees = false;
                        }
                    );
                },
                (error) => {
                    if (error.status === 404) {
                    }
                }
            );
        });

        // get contest objectives
        this.contestObjectiveListService.listContestObjectives(this.contestId).subscribe(
            (contestObjectiveListResponse) => {
                this.contestObjectiveListResponseBody = contestObjectiveListResponse.body!;

                if (!this.entryValues.length) {
                    this.entryValues = Array(this.contestObjectiveListResponseBody.data.objectives.length).fill(0);
                }

                this.loadingObjectives = false;
            },
            (error) => {
                if (error.status === 404) {
                }

                this.loadingObjectives = false;
            }
        );

        // get contest attendee entries
        this.contestAttendeeEntryListService.listContestAttendeeEntries(this.contestId).subscribe(
            (contestAttendeeEntryListResponse) => {
                this.contestAttendeeEntryListResponseBody = contestAttendeeEntryListResponse.body!;

                this.loadingEntries = false;
            },
            (error) => {
                if (error.status === 404) {
                }

                this.loadingEntries = false;
            }
        );
    }

    sortContestAttendees(attendees: any[], maxRound: number) {
        // initialize array
        this.sortedAttendees = [];

        // sort array for each round
        for (let i = 0; i < maxRound + 1; i++) {
            // explicitly create a copy of the attendees array
            let sortedAttendees = [...attendees];

            // sort based on places
            sortedAttendees.sort((a: any, b: any) => {
                return a.places[i] - b.places[i];
            });

            this.sortedAttendees.push([...sortedAttendees]);
        }
    }

    entryLess(objectiveIndex: number) {
        if (this.entryValues[objectiveIndex] > 0) {
            this.entryValues[objectiveIndex]--;
        }

        this.calculateOverallEntry();
    }

    entryMore(objectiveIndex: number) {
        if (this.entryValues[objectiveIndex] < 20) {
            this.entryValues[objectiveIndex]++;
        }

        this.calculateOverallEntry();
    }

    calculateOverallEntry() {
        this.overallEntrySum = 0;
        for (let i = 0; i < this.contestObjectiveListResponseBody.data.objectives.length; i++) {
            this.overallEntrySum +=
                this.entryValues[i] * this.contestObjectiveListResponseBody.data.objectives[i].value;
        }
    }

    logEntry() {
        let contestAttendeeEntryNewRequest: ContestAttendeeEntryNewRequest = {
            contestId: this.contestId,
            attendeeId: this.userId,
            values: this.entryValues,
        };

        this.contestAttendeeEntryNewService.logContestEntry(contestAttendeeEntryNewRequest).subscribe(
            (contestAttendeeEntryNewResponse) => {
                this.contestAttendeeEntryNewResponseBody = contestAttendeeEntryNewResponse.body!;
            },
            (error) => {
                if (error.status === 404) {
                }
            }
        );

        // empty values
        for (let i = 0; i < this.entryValues.length; i++) {
            this.entryValues[i] = 0;
        }

        this.overallEntrySum = 0;
    }

    removeTeam() {
        if (this.teamSizes.length > 0) {
            this.teamSizes.pop();
        }

        this.calculateOverallSize();
    }

    addTeam() {
        this.teamSizes.push(1);

        this.calculateOverallSize();
    }

    sizeLess(index: number) {
        if (this.teamSizes[index] > 1) {
            this.teamSizes[index]--;
        }

        this.calculateOverallSize();
    }

    sizeMore(index: number) {
        this.teamSizes[index]++;

        this.calculateOverallSize();
    }

    calculateOverallSize() {
        this.overallSizeSum = 0;

        for (let i = 0; i < this.teamSizes.length; i++) {
            this.overallSizeSum += this.teamSizes[i];
        }
    }

    generateTeams() {
        let contestTeamsNewRequest = {
            contestId: this.contestId,
            teamSizes: this.teamSizes,
        };

        this.contestTeamsNewService.generateContestTeams(contestTeamsNewRequest).subscribe(
            (contestTeamsNewResponse) => {
                this.contestTeamsNewResponseBody = contestTeamsNewResponse.body!;
            },
            (error) => {}
        );
    }

    updateTeams() {}
}
