# leaving earth

this is a digital implementation of the (rules for the) board game _leaving
earth_, designed by joe fatula and published by the lumenaris group, inc. it
defines the game in the terms of my _laika_ engine, which you can read more
about [here](https://github.com/thrilliams/laika-engine) and [here] (this will
be a post on my website eventually). this repository does not implement any
client ui for the game. for this, please look to the [singleplayer terminal
interface] (this doesn't exist yet) or [multiplayer web app] (this doesn't exist
yet either).

### planned features

-   add verbose & contextual logging for relevant changes to game state
-   modularize expansion features and allow dynamically loading them at setup
    -   mercury the first of these to expirement with dynamic type adaptation
        for the environment of the game
    -   outer planets and stations afterward as they each make more substantive
        rules changes that would require modifications to the structure of the
        state rather than just the content of it
    -   fan-made content and "modding" last, after a plausible system has been
        developed for modular content addition
-   as with laika, hidden state and choice queueing using selector functions and
    state rollback
