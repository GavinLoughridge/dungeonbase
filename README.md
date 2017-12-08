# Dungeonbase

**Dungeonbase** is a service that allows Heros and their clients to create, book, and complete Quests. You are building a web app for them. It should allow you to:

* List Heros and Quests
* Add Heros and Quests
* Assign Quests to Heros
* Modify and remove Heros and Quests

There may be some additional features, such as search, that are nice-to-haves, but a lower priority than the core features. Focus on the basic CRUD actions. The good people at Dungeonbase have provided you some sample data from their existing registry that you can use for development.

## Import stories into Issue Tracker

Import these user stories into a new project in the issue tracker of your choice. You may find it useful to prioritize the stories before you begin.

* As a user, I need to be able to identify the company (style/branding/logo)
* As a user, I need to be able to list all the Heros
* As a user, I need to be able to delete an existing Hero
* As a user, I need to be able to edit existing Hero
* As a user, I need to be able to link to a specific Hero
* As a user, I need to be able to list all the Quests
* As a user, I need to be able to easily navigate between Heros and Quests
* As a user, I need to be able to add a Quest
* As a user, I need to be able to assign a Hero to a Quest
* As a user, I need to be able to delete an existing Quest
* As a user, I need to be able to edit existing Quests
* As a user, I need to be able to link to a specific Quest
* As a user, I need to be able to link to a Quest from a Hero.
* As a user, I need to be able to link to a Hero from a Quest
* As a user, I need to be able to filter/sort Heros by price, Level, or rating
* As a user, I need to limit the number of Hero results I receive at a time
* As a user, I need to limit the number of Quests I receive at a time
* As a user, I need to search for Heros
* As a user, I need to be able to search for Quests
* As a user, I need to be able to search for active Quests
* As a user, I need to be able see the total number of Heros
* As a user, I need to be able to see the total number of Quests
* As a user, I need to be able to add a new Hero
* As a user, I need to be able to assign a Hero to a Quest
* As a user, I need to be able to complete a Quest
* As a user, I need to be able to remove a Hero from a Quest

## Sample Data

Your app should accommodate and make use of all of the following sample data, which can be downloaded [here](data/Heros.csv) and [here](data/Quests.csv). **Note that the data is denormalized,** and will require some transformation to get into the database.

1) Create an entity relationship diagram for the tables in the Dungeonbase database.
2) Create the Dungeonbase database, and write the knex migrations to create all the tables.
3) Write the knex files to seed the database with the following information:

### Heros

| Full Name        | Code Names              | Talent                     | Contact Info             | Age | Price | Rating | LEVEL |
|------------------|-------------------------|----------------------------|--------------------------|-----|-------|--------|-------|
| Bilbo Baggins    | Burglar                 | Theft                      | barrelrider@gmail.com    | 31  | 45    | 7.5    | 28    |
| Arya Stark       | A Girl                  | Disguise                   | faceless@gmail.com       | 52  | 40    | 9      | 72    |
|                  | The Doctor              | Running                    | jellybaby@gmail.com      | 28  | 20    | 6.5    | 35    |
| Rincewind        |                         | Accidents                  | disastermagnet@gmail.com | 27  | 25    | 7      | 48    |
| Roland Deschain  | Gunslinger              | Guns                       | towerfan@gmail.com       | 35  | 50    | 9.5    | 433   |
| Hermione Granger |                         | Intelligence               | nerdalert@gmail.com      | 26  | 15    | 6.5    | 13    |
| Buffy Summers    | The Slayer              | Everything                 | scooby1@gmail.com        | 41  | 30    | 8.5    | 87    |
| Thomas Anderson  | Neo, The One            | Spoon bending              | redpill@gmail.com        | 28  | 30    | 7      | 32    |
| Katniss Everdeen | The Girl on Fire        | Archery                    | D12_4_LYF@gmail.com      | 60  | 0     | 8      | 24    |

### Contracts

| Target Name       | Target Location   | Target Map                      | Target Danger   | Client Name       | Budget |
|-------------------|-------------------|---------------------------------|-----------------|-------------------|--------|
| Mount Doom        | Mordor            | https://goo.gl/images/Egk7cD    | 3               | Gandalf           | 40     |
| Beyond the Wall   | North             | https://goo.gl/images/bPVHyf    | 9               | Ned Stark         | 70     |
| Death Star        | Endor             | https://goo.gl/images/W3ycjT    | 7               | Mon Mothma        | 35     |
| Hogwarts          | England           | https://goo.gl/images/x7aafj    | 10              | Lord Voldemort    | 25     |
| The Capital       | District 1        | https://goo.gl/images/TZpW4k    | 4               | Alma Coin         | 10     |

## ERD

<mxfile userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36" version="7.8.4" editor="www.draw.io" type="github"><diagram id="c1194238-21c7-1b7e-91fe-c7096d52286b" name="Page-1">3VrbcqM4EP0aHrMFyGDymGQysw87VVubrdrZp5QMbcwEI0aWb/P1K4EAcbPBxphZpyqGltRqS0d9uhs09LI+fKE4Xn0lHoSaqXsHDX3STHNuIP5fCI6pwLKlwKeBl4qMQvAW/AQp1KV0G3iwKXVkhIQsiMtCl0QRuKwkw5SSfbnbkoTlWWPsQ03w5uKwLv0n8NgqlTqWXsh/h8BfZTMbumxZYPfDp2Qbyfk0Ey2TT9q8xpku2X+zwh7ZKyL0qqEXSghLr9aHFwjF0mbLlo773NKa200hYl0G2OmAHQ63kFlsh3zosxfshH3sKNfE/rEVRj0zOLAHHAZ+pKEn3iOEJSta+ZUvvxMtmxhHmWwFlGyyBm6S2qaIk4nL0uFteUjXYDrGxEA3JHqflE2Mn4eITcggftwZdqdkkfAj07EmpoE7JXsoZkHkT8igEHaCqHrZY5bsMIUBwpmxdcgFhpiEUfIBLyQkNOmCPHthWzZvWQZhqMg5DZiuy+XS/k8uP17AG593QFnA6edJNqwDzxMTPu9XAYO3GLti9j3nWi5L6AWEA9dzA4UCOLSSgJFTC2dsIGtg9Mi7yAGOJCNJ1uZM3u8L6jMyZl6ptJd1xJJu/Vx1QTn8QrJOMwPNaysMHudieUsoWxGfRDh8LaSVFVC2Ag4B+ybEv80tefuv7MXXgh7VNnGfNX4Hxo4yDMFbRriomPkPQmKpP7VVGHh6qfnvIVvqQolkGaY+MEVU3xAKIT8yu7L2a1bXGJPgo8D9iPAazpG8crweEkhRUia+Nn9w+nBn05+ZfUG7eaDr/YDtOrBY1v2Ah8FZTt8PzMwx/YDxeGOkKpuZRKLvP7awYZvOsBsSqsnU54O98aDqmAtkN1CWZ4HjzaYHVRPdE6vZZKN4VbL4zlNcTgo93WoPmLYlIOdHhcTlhEWiXoPWHBPXniAPRz7QyZyfhWPNLL0h5HNcmGLIh+7q6zN7Rzk/NTff6+zUIVTpmh/PvkcnscvnA2nfkRT2mJ4Z0kmRS9ZxCAyuJ7Rc0/viOJlD+WjPEW4gNTA4rc2nfyjHTcRE19qhrKZmkfckyqv87vWvnzwY+pt8xdFRa0nC1Bws3SFMWaGARJAJPwfCLpmoefLuyoyrvs7KOloNy5jJOmdhcoY/SSDKZC1htI0qm5MaKgeptdmKHgNZzT46U5QmlDVFyUbnv7rb3qPB935e3XwlATdrCXh50zvh5ApklHPxNPP49dFSVmQ5t0OLNThazBNoqZdrRkNL/vBpMnAx5qi0zejxQryYtlP2LlXgDYiXpiLUKbzwLexHLApaToBFHx8sykO9e4DFKYNlpl8KlnkFLNWAY0CwzAd2LoaCFQUe3zSlLqy2tboWwk26JQ+1RYcjYeWxghXjUqw4FaxYt8OK04CVm+aRSb52u2SyYxHmZgXr5NNQxbDE3/QSJsu8a8LUVLE+Q2vDuqgGQit5Q9VVXZ5MNfKac09fNZuVM6OLg6CqohsGQZnmwX1V6jO6PMf4f79B0+HR3/UeUk8+DR4yfclrch6yVucd00GipjJvPwfZ4gbz4kLde5pnXOStozh014j/F6wmIHM4lFRqBSdqDGcyw0FRkoWp04GJqVcCJ8e6DCc580pFhlVRNCBO+tYo23FiaPWg6kQoNhJK9MmhxKig5PFClMwqcDPsbijh64yPSrdYdNi0G2zbFbaz9ZN22VYVvaX+/CK1oCNk+W3x5nbavXg7Hr3+Bw==</diagram></mxfile>


## Notes

* Use feature-branch workflows.
* Deploy your work.

## How to Submit Your Assessment

Fork/clone this repo.
Add a README to your project that has:

* A link to your deployed site
* Link to your issue tracker
* Links to your repo with updated code
* A data model of the final data model of the project
