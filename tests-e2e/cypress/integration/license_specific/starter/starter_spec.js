// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// ***************************************************************

describe('runs > retrospective', () => {
    const playbookName = 'Starter Playbook';
    let testTeam;
    let testUser;

    before(() => {
        cy.apiInitSetup().then(({team, user}) => {
            testTeam = team;
            testUser = user;

            // # Create a public playbook
            cy.apiCreatePlaybook({
                teamId: testTeam.id,
                title: playbookName,
                memberIDs: [],
            }).then((playbook) => {
                cy.apiRunPlaybook({
                    playbookRunName: 'starter run',
                    ownerUserId: testUser.id,
                    playbookId: playbook.id,
                    teamId: testTeam.id
                });
            });
        });
    });

    beforeEach(() => {
        cy.apiLogin(testUser);
    });

    it('retro functionality is unavailable', () => {
        cy.visit(`/${testTeam.name}/channels/starter-run`);

        cy.findByText('Finish run').click();
        cy.findByRole('dialog', {name: /confirm finish run/i}).within(() => {
            cy.findByRole('button', {name: /finish run/i}).click();
        });

        cy.findByText('Run details').click();
        cy.findByText('Retrospective').click();
        cy.findByRole('button', {name: /notify system admin/i}).should('exist');
    });
});
