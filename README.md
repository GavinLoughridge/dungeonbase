# DUNGEONBASE

**DUNGEONBASE** is a service that allows HEROs and their clients to create, book, and COMPLETE QUESTs. You are building a web app for them. It should allow you to:

* List HEROs and QUESTs
* Add HEROs and QUESTs
* Assign QUESTs to HEROs
* Modify and remove HEROs and QUESTs

There may be some additional features, such as search, that are nice-to-haves, but a lower priority than the core features. Focus on the basic CRUD actions. The good people at DUNGEONBASE have provided you some sample data from their existing registry that you can use for development.

## Import stories into Issue Tracker

Import these user stories into a new project in the issue tracker of your choice. You may find it useful to prioritize the stories before you begin.

* As a user, I need to be able to identify the company (style/branding/logo)
* As a user, I need to be able to list all the HEROs
* As a user, I need to be able to delete an existing HERO
* As a user, I need to be able to edit existing HERO
* As a user, I need to be able to link to a specific HERO
* As a user, I need to be able to list all the QUESTs
* As a user, I need to be able to easily navigate between HEROs and QUESTs
* As a user, I need to be able to add a QUEST
* As a user, I need to be able to assign a HERO to a QUEST
* As a user, I need to be able to delete an existing QUEST
* As a user, I need to be able to edit existing QUESTs
* As a user, I need to be able to link to a specific QUEST
* As a user, I need to be able to link to a QUEST from a HERO.
* As a user, I need to be able to link to a HERO from a QUEST
* As a user, I need to be able to filter/sort HEROs by price, LEVEL, or rating
* As a user, I need to limit the number of HERO results I receive at a time
* As a user, I need to limit the number of QUESTs I receive at a time
* As a user, I need to search for HEROs
* As a user, I need to be able to search for QUESTs
* As a user, I need to be able to search for active QUESTs
* As a user, I need to be able see the total number of HEROs
* As a user, I need to be able to see the total number of QUESTs
* As a user, I need to be able to add a new HERO
* As a user, I need to be able to assign a HERO to a QUEST
* As a user, I need to be able to complete a QUEST
* As a user, I need to be able to remove a HERO from a QUEST

## Sample Data

Your app should accommodate and make use of all of the following sample data, which can be downloaded [here](data/HEROs.csv) and [here](data/QUESTs.csv). **Note that the data is denormalized,** and will require some transformation to get into the database.

1) Create an entity relationship diagram for the tables in the DUNGEONBASE database.
2) Create the DUNGEONBASE database, and write the knex migrations to create all the tables.
3) Write the knex files to seed the database with the following information:

### HEROs

| Full Name        | Code Names              | TALENT                     | Contact Info             | Age | Price | Rating | LEVEL |
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
