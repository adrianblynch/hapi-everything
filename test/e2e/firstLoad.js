
Feature('Page initially loads');

Scenario('Going to the base URL', (I) => {
	I.amOnPage('/');
	I.seeInTitle('Hapi Everything - React MUI');
});
