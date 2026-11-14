# Notes

- IMO the time limit of this assignment doesn’t allow the proper reasoning and polish which I would want since we’re setting up a repo from scratch. Allot of the foundational design patterns take some time to properly setup before AI really improves velocity in production grade code.
- The domain separation can be improved a bit in the backend by defining explicit repository, service, and resolver types / schemas. It was my intention to do this from the start but I didn’t quite get it right. For example repository API response type and repository return type should ideally be split up.
- An improvement I’d like to add is adding zod-openapi to generate swagger for the endpoints, then hook it up using openapi-ts to generate types in frontend which gives full type safety for the whole repo. That way we don’t need to duplicate or share the schemas.
- Caching should be improved, probably doesn’t take allot since there’s some simple in memory cache libraries that can be used.
- Frontend I would’ve liked to take more time to get a cleaner design look and split out components into different files. Allot of the code here is very rough since I didn’t really have time to properly check & reason about it.
- Would be nice to polish a bit and remove confusing / redundant comments
- Unknown tickers fail the whole summary request. Would be nice to be more resilient
- Tests would be nice to add for at least the more complex logic. I’d suggest unit tests for utility functions and perhaps integration tests with mocked data.
- There’s some edge case bugs which AI has identified that result in unclear behavior such as using page 999 showing an empty table an a warning
- Some documentation on how the service works along with the design patterns used.


## Scope limitations (According to AI)

- Only recent Edgar filings are used, so filings over a year or so old aren’t shown
- Does not accept dot notation for share-class tickers
