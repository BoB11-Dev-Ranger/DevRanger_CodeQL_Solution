# Devranger's Auto Code Auditing Solution

---

## Concept

This is the Code Auditing Web Solution with CodeQL which made by `DevRanger Team` for Best of the Best 11th project.

---

## Development Usage

This server is made of the `mono repo` structure.

So, You can establish the server & client with this command.

- Build Server : `yarn server dev`

- Build Client : `yarn client start`

If you wanna add some node moudle, you can add modules to each package with this command.

- Add Modules for Client : `yarn client add <module name>`

- Add Modules for Server : `yarn server add <module name>`

Before execute server, You should set enviornment value for db.

1. **DB_HOST** : Database host name of mysql.

2. **DB_USERNAME** : Database user name of mysql.

3. **DB_PASSWORD** : Database password of mysql.

4. **DB_NAME** : Database name of mysql.

### IMPORTANT!!!

Then, For codeql service, you should download codeql-cli and set that path in `$PATH`.

And your analysis CodeQL query should be in `~/codeql-repo_DIR/javascript/ql/src/myql` which is used by server's codeql querying api.

---

## Solution Usage

If you established the server successfully, you can see this web view.

![Alt text](https://i.imgur.com/PonZnsn.png)

Upload your zip-compressed repository in this solution and click `코드 점검` button for code auditing execution.

Some times later, You can see these audit results.

![Alt text](https://i.imgur.com/zmBPi9A.png)

---

## Contact

[a42873410@gmail.com](a42873410@gmail.com)
