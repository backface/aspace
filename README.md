# a.space

An experimental, spatialized multi audio stream interface commissoned by [servus.at](https://core.servus.at/) for [AMRO22 - Art Meets Radical Openness](https://radical-openness.org/en)

Frontend in [Vue.js](https://vuejs.org/),

with a Nodes.js/express/socket.io server backend for realtime chat and audience position sharing

written by [Michael Aschauer](https://m.ash.to/)


## about a.space

a.space is a distributed sound installation, that interconnects different physical venues through a directional loop, affected by space, feedback and acoustic events. Through a virtual platform it is possible to listen, choose a point of perspective and interact with others.

The project was realized and first shown in the frame of [AMRO22](https://art-meets.radical-openness.org), in collaboration with [bb15](https://bb15.at/), [Emanat Institute](https://emanat.si/), [Ústí nad Labem House of Arts](https://duul.cz/en/). It was activated by [Stefan Tiefengraber](http://www.stefantiefengraber.com/  ) in Linz, [Polina Khatsenka](https://www.works.io/polina-khatsenka) in Ústí nad Labem, [Luka Prinčič ](https://lukaprincic.si/) and [ala pecula](https://alapecula.zone/) in Ljubljana.

The project was conceptualized by Davide Bevilacqua and Gabriela Gordillo, realized by [servus.at](https://www.servus.at)  with the support of Linz_Sounds 2021. The web Interface developed by [Michael Aschauer](https://m.ash.to/), its source code is shared for further use as an open source tool.

The virtual platform is accessible online at [a-space.servus.at](https://a-space.servus.at)


## configuration

stream sources and configuration reside in:

```
frontend/public/streams_config.json
```

Just change or add your audio file or stream source here
(and depending on deployment rebuild, mount it via docker or just serve it via nginx,...)

In theory you can use it with as many audio source as you want, but it's only used and tested with 3 and likely might need layout or code adaptions
for larger amounts.


## Project setup

just run:

```
docker-composer up --build
```

see Dockerfile for detailed build process / instructions

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

## License

Copyright (c) 2022, Michael Aschauer

a.space is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see https://www.gnu.org/licenses/.
