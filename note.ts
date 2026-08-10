/*


> create project folder
> terminal : -> git init
> create file -> .gitignore 
               ? add > 
                      > node_modules
                      > dist
> terminal : 
npm init
npm install typescript tsx @types/node --save-dev
npx tsc --init

terminal answer : 
package name : fixitnow
0.0.1
skip this part  description
entry point : server.ts
skip this part  test command
skip this part git repository
skip this part keywards
skip this part keywards author
skip this part keywards author license
type : (commonjs) module

terminal : 
npm install prisma @types/pg --save-dev
npm install @prisma/client @prisma/adapter-pg pg dotenv


on tsconfig.json :
select all thne pasete the code 
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "types": ["node"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },

  "exclude": ["node_modules", "dist"]
}



gitignore file add those: 
generated
.env

termial : 
npx prisma
npx prisma init --output ../generated/prisma



setup database url inside --->  .env
.env.example file setup -> just example 


Terminal :

npm i express
npm i @types/express --save-dev
npm i bcryptjs
npm i cors
npm i @types/cors --save-dev
npm i cookie-parser
npm i @types/cookie-parser --save-dev
npm i http-status
npm i jsonwebtoken
npm i @types/jsonwebtoken --save-dev


in root folder : 
crate folder : 
> src
   > create file 
    > app.ts
    > server.ts


add this line on package.json
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build" : "tsc",
    "start"  : "node dist/server.js",

terminal : 
to build --> npm run build   
to run   --> npm run dev



create lib folder indde src
then inded lib cerate file ->> prisma.ts
then paset : 
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };



delete -> import { PrismaClient } from "../../generated/prisma/client";


terminal :
npx prisma migrate dev
npx prisma generate


import prisma client again insde the prisma.ts



inside prisma.config.js 
schema: "prisma/schema.prisma", 
change to 
schema: "prisma/schema", /// pointing to schem folder
                        


create schema folder inside the prisma folder
then move schema.prisma file to schema folder 
now all schma wiil be created insde the schem folder


inside schema.prisma folder :
output   = "../generated/prisma"
change to 
output   = "../../generated/prisma"
/// to generate the generate folder indide root folder 



///-------------------

stripe 

npm i stripe

then inside lib folder : 
create -> stripe.ts


----

npm i -g @stripe/cli   -> install strpie cli

stripe login  -> to log in -> if url -> ctrl + click on tah url to enter
if error appares then we need to configer .env file 

--
after middlewer api end point set  up then :

go to pakage.json :

insde "script" to make a new secrept

after "start" :

"stripe:webhook" : "stripe listen --forward-to localhost:5000/api/payments/webhook",


now on terminal : 
npm run stripe:webhook


now add the secret to env

-------

to check /webhook route :
payment intent : 

using terminal : 

> stripe trigger payment_intent.succeeded
> stripe trigger payment_intent.payment_failed



*/