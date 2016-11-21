# Cat Community Manager

Prior to running the app, you now need to have MySQL running on your local machine, and it needs to be responding at port 3306 (default MySQL port). If you're unfamiliar with running MySQL on your local system, please see the following link:

http://dev.mysql.com/doc/mysql-getting-started/en/

You can also run it locally using Docker (my preferred method):

https://www.docker.com/products/docker
https://kitematic.com/

Within Kitematic you can search for MySQL and find the official repo. You'll want to make sure that you change under Settings > General, that you set the Environment Variables to include:

| Key | VALUE |
| ---- | ----- |
| MYSQL_ROOT_PASSWORD | kittycats |

Also make sure to set ports as follows:

| DOCKER PORT | ***IP:PORT |
| ---- | ----- |
| 3306 | localhost:3306 |

If you have any questions about setting up MySQL locally, just message mootrichard.

To get things running after pulling in the repo, first run the following command:

`npm install`

Once this has completed, you should have the relevant packages installed in your node_modules folder (this is currently ignored in git using .gitignore to keep the repo smaller).

To get the server running, simply run the command:

`npm start`

This should get the server running on http://localhost:3000 (we will adjust that for product purposes, but for now this is how to run and test it in development).
