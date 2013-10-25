memorybattle  
============  
  
A game like memory, but with a competitive twist  
  
The goal of this game is an attempt to utilize, hopefully, SignalR and websockets to allow realtime  
updates to a users stack of tiles.  
  
Player(s) will start with a set of 8 tiles, 4 pairs of 2.  
  
#Single Player Mode  
1. Flip over pairs of cards that match  
2. All cards are matched you WIN  
  
  
#Multi-Player Mode  
1. Flip over pairs of cards that match  
   a. Your matched pair will cause other players to have two more tiles add to their game.  
   b. Cards other players match will cause your tile set to be increased by each matched set  
2. All cards are matched you are the ultimate ruler.  
  
  
Players will be able to see other players in their game and which cards  
they have flipped over, in comes SignalR or something.

