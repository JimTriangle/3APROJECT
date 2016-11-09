CREATE TABLE "Users" ("id_user" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
 "nom_user" VARCHAR NOT NULL , 
 "prenom_user" VARCHAR NOT NULL , 
 "email_user" VARCHAR NOT NULL ,
 "password_user" VARCHAR NOT NULL ,
 "date_naiss_user" DATETIME NOT NULL);

CREATE TABLE "Tokens" ("id_token" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
"id_user" INTEGER NOT NULL,
"token" VARCHAR NOT NULL,
"date_last_use" DATETIME NOT NULL,
 FOREIGN KEY(id_user) REFERENCES Users(id_user));
