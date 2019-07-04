Feature: Google

Scenario: Searching
  Given I am a user
  When I launch https://google.com
  And I type google into name=q
  And I click on input name=q I press Enter
  Then I see search result
