# Recitation 6

This repository contains the solutions to interactive live-coding exercises referenced in Recitation 6 (10/13/22). You can view the slides that accompanied these exercises [here](https://docs.google.com/presentation/d/1yNoeeosVncDN1l2SKk3Autzy2E9pXLBfizwX3W5L0h4/edit?usp=sharing).

Initial code is provided in `index.ts`. Solution is provided in `solution.ts`.

## Setup

### MongoDB Atlas

Follow the instructions [here](https://docs.google.com/presentation/d/1HJ4Lz1a2IH5oKu21fQGYgs8G2irtMqnVI9vWDheGfKM/edit?usp=sharing) to add your fritter project to MongoDB Atlas.

After following the instructions above, you should have copied a secret that looks something like `mongodb+srv://xxxxxx:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority`. Note that this allows complete access to your database, so do not include it anywhere that is pushed to GitHub or any other publicly accessible location.

To allow your local server to connect to the database you just created, create a file named .env in the project's root directory with the contents:

```sh
MONGO_SRV=mongodb+srv://xxxxxx:xxxxxxxxx@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority
PASSWORD=password
```
where the everything after `MONGO_SRV=` is replaced with the one you obtained
and `password` contains the password you set for your database user account.

### Running the code
* Run `npm install` to install dependences.
* Run `npm run dev` to launch the `index.ts` file with live-reloading on every file save
* Run `npm start` to launch the file normally.
