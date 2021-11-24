// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// ***************************************************************

describe('playbooks > list permissions', () => {
    let testTeam;
    let testTeam2;
    let testUser;
    let testUser2;

    // Permissions permutations:
    let pbPublicPrivateChan; // Condition 1
    let pbPublicPublicChan; // Condition 2
    let pbPrivateWithTestUser2PrivateChan; // Condition 3
    let pbPrivateWithTestUser2PublicChan; // Condition 4
    let pbPrivateWithoutTestUser2PrivateChan; // Condition 5
    let pbPrivateWithoutTestUser2PrivateChanTestUser2ChanMember; // Condition 6
    let pbPrivateWithoutTestUser2PublicChan; // Condition 7
    let pbPublicTestTeam2PrivateChan; // Condition 8
    let pbPublicTestTeam2PublicChan; // Condition 9

    // Run names corresponding to conditions:
    const runs = [];
    const runPublicPrivateChan = 0;
    const

    before(() => {
        cy.apiInitSetup().then(({team, user}) => {
            testTeam = team;
            testUser = user;

            // # Create another user
            cy.apiCreateUser().then(({user: anotherUser}) => {
                testUser2 = anotherUser;

                cy.apiAddUserToTeam(testTeam.id, anotherUser.id);
            });

            // # Create another team
            cy.apiCreateTeam('second-team', 'Second Team').then(({team: team2}) => {
                testTeam2 = team2;

                const now = Date.now();
                const runNamePrefix = 'Run ' + now;

                // # Add testUser, but not testUser2
                cy.apiAddUserToTeam(testTeam2.id, testUser.id);

                // # Login as testUser
                cy.apiLogin(testUser);

                // # Condition 1: Public playbook on TestTeam, private channel
                cy.apiCreatePlaybook({
                    teamId: testTeam.id,
                    title: 'Public Playbook on TestTeam - private channel',
                    memberIDs: [],
                    createPublicPlaybookRun: false,
                }).then((playbook) => {
                    pbPublicPrivateChan = playbook;

                    cy.apiRunPlaybook({
                        teamId: testTeam.id,
                        playbookId: pbPublicPrivateChan.id,
                        playbookRunName: `${runNamePrefix} Condition 1`,
                        ownerUserId: testUser.id,
                    }).then((resp) => {
                        runs[0] = resp;
                    });
                });

                // # Condition 2: Public playbook on TestTeam, public channel
                cy.apiCreatePlaybook({
                    teamId: testTeam.id,
                    title: 'Public Playbook on TestTeam - public channel',
                    memberIDs: [],
                    createPublicPlaybookRun: true,
                }).then((playbook) => {
                    pbPublicPublicChan = playbook;

                    cy.apiRunPlaybook({
                        teamId: testTeam.id,
                        playbookId: pbPublicPublicChan.id,
                        playbookRunName: `${runNamePrefix} Condition 2`,
                        ownerUserId: testUser.id,
                    }).then((resp) => {
                        runs[1] = resp;
                    });
                });

                // # Condition 3: Private playbook on TestTeam, testUser2 member, private channel
                cy.apiCreatePlaybook({
                    teamId: testTeam.id,
                    title: 'Private Playbook on TestTeam with testUser2 - Private Channel',
                    memberIDs: [testUser.id, testUser2.id],
                    createPublicPlaybookRun: false,
                }).then((playbook) => {
                    pbPrivateWithTestUser2PrivateChan = playbook;

                    cy.apiRunPlaybook({
                        teamId: testTeam.id,
                        playbookId: pbPrivateWithTestUser2PrivateChan.id,
                        playbookRunName: `${runNamePrefix} Condition 3`,
                        ownerUserId: testUser.id,
                    }).then((resp) => {
                        runs[2] = resp;
                    });
                });

                // # Condition 4: Private playbook on TestTeam, testUser2 member, public channel
                cy.apiCreatePlaybook({
                    teamId: testTeam.id,
                    title: 'Private Playbook on TestTeam with testUser2 - Public Channel',
                    memberIDs: [testUser.id, testUser2.id],
                    createPublicPlaybookRun: true,
                }).then((playbook) => {
                    pbPrivateWithTestUser2PublicChan = playbook;

                    cy.apiRunPlaybook({
                        teamId: testTeam.id,
                        playbookId: pbPrivateWithTestUser2PublicChan.id,
                        playbookRunName: `${runNamePrefix} Condition 4`,
                        ownerUserId: testUser.id,
                    }).then((resp) => {
                        runs[3] = resp;
                    });
                });

                // # Condition 5: Private playbook on TestTeam, testUser2 not member, private channel
                cy.apiCreatePlaybook({
                    teamId: testTeam.id,
                    title: 'Private Playbook on TestTeam without testUser2 - Private Channel',
                    memberIDs: [testUser.id],
                    createPublicPlaybookRun: false,
                }).then((playbook) => {
                    pbPrivateWithoutTestUser2PrivateChan = playbook;

                    cy.apiRunPlaybook({
                        teamId: testTeam.id,
                        playbookId: pbPrivateWithoutTestUser2PrivateChan.id,
                        playbookRunName: `${runNamePrefix} Condition 5`,
                        ownerUserId: testUser.id,
                    }).then((resp) => {
                        runs[4] = resp;
                    });
                });

                // # Condition 6: Private playbook on TestTeam, testUser2 not member, private channel, testUser2 chan member
                cy.apiCreatePlaybook({
                    teamId: testTeam.id,
                    title: 'Private Playbook on TestTeam without testUser2 - Private Channel, testUser2 chan member',
                    memberIDs: [testUser.id],
                    createPublicPlaybookRun: false,
                    invitedUserIds: [testUser2.id],
                    inviteUsersEnabled: true,
                }).then((playbook) => {
                    pbPrivateWithoutTestUser2PrivateChanTestUser2ChanMember = playbook;

                    cy.apiRunPlaybook({
                        teamId: testTeam.id,
                        playbookId: pbPrivateWithoutTestUser2PrivateChanTestUser2ChanMember.id,
                        playbookRunName: `${runNamePrefix} Condition 6`,
                        ownerUserId: testUser.id,
                    }).then((resp) => {
                        runs[5] = resp;
                    });
                });

                // # Condition 7: Private playbook on TestTeam, testUser2 not member, public channel
                cy.apiCreatePlaybook({
                    teamId: testTeam.id,
                    title: 'Private Playbook on TestTeam without testUser2 - Public Channel',
                    memberIDs: [testUser.id],
                    createPublicPlaybookRun: true,
                }).then((playbook) => {
                    pbPrivateWithoutTestUser2PublicChan = playbook;

                    cy.apiRunPlaybook({
                        teamId: testTeam.id,
                        playbookId: pbPrivateWithoutTestUser2PublicChan.id,
                        playbookRunName: `${runNamePrefix} Condition 7`,
                        ownerUserId: testUser.id,
                    }).then((resp) => {
                        runs[6] = resp;
                    });
                });

                // # Condition 8: Public playbook on TestTeam2, private channel
                cy.apiCreatePlaybook({
                    teamId: testTeam2.id,
                    title: 'Public Playbook on TestTeam2 - private channel',
                    memberIDs: [],
                    createPublicPlaybookRun: false,
                }).then((playbook) => {
                    pbPublicTestTeam2PrivateChan = playbook;

                    cy.apiRunPlaybook({
                        teamId: testTeam2.id,
                        playbookId: pbPublicTestTeam2PrivateChan.id,
                        playbookRunName: `${runNamePrefix} Condition 8`,
                        ownerUserId: testUser.id,
                    }).then((resp) => {
                        runs[7] = resp;
                    });
                });

                // # Condition 9: Public playbook on TestTeam2, public channel
                cy.apiCreatePlaybook({
                    teamId: testTeam2.id,
                    title: 'Public Playbook on TestTeam2 - public channel',
                    memberIDs: [],
                    createPublicPlaybookRun: true,
                }).then((playbook) => {
                    pbPublicTestTeam2PublicChan = playbook;

                    cy.apiRunPlaybook({
                        teamId: testTeam2.id,
                        playbookId: pbPublicTestTeam2PublicChan.id,
                        playbookRunName: `${runNamePrefix} Condition 9`,
                        ownerUserId: testUser.id,
                    }).then((resp) => {
                        runs[8] = resp;
                    });
                });
            });
        });
    });

    beforeEach(() => {
        // # Size the viewport to show all
        cy.viewport('macbook-13');
    });

    describe.only('shows all runs to testUser', () => {

        before(() => {
            // # Login as testUser
            cy.apiLogin(testUser);
        });

        const expectedRuns = {
            0: true,
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true,
            7: true,
            8: true,
        }
        for (let i in expectedRuns) {
            if (expectedRuns[i]) {
                it(`shows run${i}`, () => {
                    verifyRunIsVisible(runs[i]);
                });
            } else {
                it(`hides run${i}`, () => {
                    verifyRunIsNotVisible(runs[i]);
                })
            }
        }
    });

    it('restricts some runs from testUser2', () => {
        // # Login as testUser2
        cy.apiLogin(testUser2);

        verifyRunIsVisible(runs[0]);
        verifyRunIsVisible(runs[1]);
        verifyRunIsVisible(runs[2]);
        verifyRunIsVisible(runs[3]);
        verifyRunIsNotVisible(runs[4]);
        verifyRunIsVisible(runs[5]);
        verifyRunIsNotVisible(runs[6]);
        verifyRunIsNotVisible(runs[7]);
        verifyRunIsNotVisible(runs[8]);
    });

    it('restricts some runs from sysadmin without sudo', () => {
        // # Login as sysadmin
        cy.apiAdminLogin();

        verifyRunIsVisible(runs[0]); // this playbook is public, even though the channel is private
        verifyRunIsVisible(runs[1]); // this playbook and channel are both public
        verifyRunIsNotVisible(runs[2]); // this user is not a member of the playbook nor private channel
        verifyRunIsNotVisible(runs[3]); // this user is not a member of the playbook nor public channel
        verifyRunIsNotVisible(runs[4]); // this user is not a member of the playbook nor private channel
        verifyRunIsNotVisible(runs[5]); // this user it not a member of the playbook nor private channel
        verifyRunIsNotVisible(runs[6]); // this user is not a member of the playbook, despite the channel being public
        verifyRunIsNotVisible(runs[7]); // this user is not a member of team 2
        verifyRunIsNotVisible(runs[8]); // this uesr is not a member of team 2
    });

    it('shows runs to sysadmin with sudo', () => {
        // # Login as sysadmin
        cy.apiAdminLogin();

        cy.sudo();

        verifyRunIsVisible(runs[0]);
        verifyRunIsVisible(runs[1]);
        verifyRunIsVisible(runs[2]);
        verifyRunIsVisible(runs[3]);
        verifyRunIsVisible(runs[4]);
        verifyRunIsVisible(runs[5]);
        verifyRunIsVisible(runs[6]);
        verifyRunIsVisible(runs[7]);
        verifyRunIsVisible(runs[8]);
    });

    it('restricts some runs from sysadmin after dropping sudo', () => {
        // # Login as sysadmin
        cy.apiAdminLogin();

        cy.sudo();
        cy.dropSudo();

        verifyRunIsVisible(runs[0]); // this playbook is public, even though the channel is private
        verifyRunIsVisible(runs[1]); // this playbook and channel are both public
        verifyRunIsNotVisible(runs[2]); // this user is not a member of the playbook nor private channel
        verifyRunIsNotVisible(runs[3]); // this user is not a member of the playbook nor public channel
        verifyRunIsNotVisible(runs[4]); // this user is not a member of the playbook nor private channel
        verifyRunIsNotVisible(runs[5]); // this user it not a member of the playbook nor private channel
        verifyRunIsNotVisible(runs[6]); // this user is not a member of the playbook, despite the channel being public
        verifyRunIsNotVisible(runs[7]); // this user is not a member of team 2
        verifyRunIsNotVisible(runs[8]); // this uesr is not a member of team 2
    });
});

const verifyRunIsVisible = (run) => {
    // # Open Runs
    cy.visit('/playbooks/runs');

    // # Filter to all runs
    cy.findByTestId('my-runs-only').click();

    // # Find the playbook run and click to open details view
    cy.get('#playbookRunList').within(() => {
        cy.findByText(run.name).click();
    });

    // * Verify that the header contains the playbook run name
    cy.findByTestId('playbook-run-title').contains(run.name);
};

const verifyRunIsNotVisible = (run) => {
    // # Open Runs
    cy.visit('/playbooks/runs');

    // # Filter to all runs
    cy.findByTestId('my-runs-only').click();

    // * Verify the playbook run is not visible
    cy.get('#playbookRunList').within(() => {
        cy.findByText(run.name).should('not.exist');
    });

    // # Opening the playbook run directly
    cy.visit(`/playbooks/runs/${run.id}/overview`);

    // * Verify the not found error screen
    cy.get('.error__container').within(() => {
        cy.findByText('Run not found').should('be.visible');
        cy.findByText('The run you\'re requesting is private or does not exist.').should('be.visible');
    });
};
