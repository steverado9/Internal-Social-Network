# Internal social network
The goal of this
application is to facilitate more interaction between colleagues and promote team bonding.

## Tools
1. Node/Express
1. Github project board
1. Eslint: To catch errors
1. Mocha: For testing endpoints
1. Postgres: Database
1. bcrypt: to hash the passwords in the database
1. Jwt: to get token and authenticate it
1. cloudinary: To save the gifs
1. swagger: To test our api end points


|           Methods             |           urls                        |               Actions            |
|           :-----:             |           :-----:                     |               :-----:            |
|           post                |          api/v1/auth/create-user      |         create a user account    |      
|           post                |          api/v1/auth/signin           |         sign into a user's account   |      
|           post                |          api/v1/articles              |         post an article   |      
|           put                 |          api/v1/articles/id              |         edit an article   |      
|           delete                 |          api/v1/articles/id              |         delete an article   |      
|           post                 |          api/v1/articles/id/comment         |         comment on an article   |      
|           get                 |          api/v1/articles/id         |         get an article   |      
|           post                 |          api/v1/gifs         |         post a gif   |      
|           delete                 |          api/v1/gifs/id         |         delete a gif   |      
|           post                 |          api/v1/gifs/id/comment         |         comment on a gif   |      
|           get                 |          api/v1/gifs/id         |         get a gif   |      
|           get                 |          api/v1/feed         |         view all articles and gifs   |      

