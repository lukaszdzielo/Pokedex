# Pokedex
This is a project to create a Pokedex using data from the PokemonAPI. This project is for educational purposes only and is my own original code. The project is still under development, and the final form is not yet determined.

As of December 20, 2023, there are over 1000 Pokémon. I want to optimize the search so that I don't have to make a query for each one. This will involve downloading the species, special names, types, generations and a local database will be built based on this data. There are about 10 generations and 20 types, plus a number of Pokémon with names that contain spaces, hyphens, or other special characters. However, this is still less than 1000 queries. I am not using GraphQL here because the database is updated less frequently, and the Pokémon API is updated regularly. This data is stored in the local memory of the user's browser, which will significantly speed up processes in the application.

Todo list

- Databuilder
    - [x] names
    - [x] names with special characters
    - [x] types
    - [x] generations
    - [ ] img checker
- List
    - [x] updater
- Card
    - [x] builder
    - [x] names
    - [ ] images
    - [ ] types
- Pagination
    - [ ] desktop list
    - [ ] desktop arrows
    - [x] mobile select
    - [x] mobile arrows
- Dialogs
    - [x] show / close
- Settings dialog
    - [x] scheme switcher
    - [x] import / export
    - [x] data remover / reset app