
Feature('Page initially loads');

Scenario('Going to the base URL', (I) => {
	I.amOnPage('/');
	I.seeInTitle('Hapi Everything - React MUI');
	I.see('React Material UI')
	I.see('DELETE SELECTED USERS');
	I.see('ADD NEW USER');
	I.see('ID')
	I.see('First name')
	I.see('Last name')
	I.see('Email')
});
