# a.space

An experimental, spatialized multi audio stream interface for [AMRO22 - Art Meets Radical Openness](https://radical-openness.org/en)

Frontend in [Vue.js](https://vuejs.org/),

with a Nodes.js/express/socket.io server backend for realtime chat and audience position sharing

written by [Michael Aschauer](https://m.ash.to/)




## License


Copyright (c) 2022, Michael Aschauer

a.space is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see https://www.gnu.org/licenses/.


## Project setup

just run:

```
docker-composer up --build 
```

see Dockerfile for detailed build instructions

## Development

Frontend/UI:

```
  cd frontend
  npm install
  npm run dev
```

Backend/server:

```
  cd backend 
  npm install
  npm run startdev
```  
  
