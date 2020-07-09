# Automatic Invoice
This is an automatic invoice twitter bot that helps you with your business on twitter

# Purpose
This bot purposes to help online shop (especially on twitter) to calculate customer's order faster.

# Benefit
1. The online shop on twitter doesn't need to move from twitter application just only to calculate the invoice
2. The online shop's services can be a lot faster

# How to Use This App

### For User

1. User can order by tweeting spesific format that provided by the online shop

   example format:

   #heyorder (space) menu (quantity) (comma) (space) menu (quantity) 
![atu](https://user-images.githubusercontent.com/43996652/87069268-19383c00-c241-11ea-957d-90bc4303fc5f.jpg)


2. After tweeting that spesific format, the user will get replies from the online shop
![Inkedexample_2_LI](https://user-images.githubusercontent.com/43996652/87069481-73d19800-c241-11ea-9028-16a84b774495.jpg)

### For Online Shop


1. Online shop should apply twitter developer acc first and install node js & twit library on their laptop/pc. 
   You can read the tutorial here: https://medium.com/science-friday-footnotes/how-to-make-a-twitter-bot-in-under-an-hour-259597558acf,
   If you already accepted as twitter developer acc and install node js & twit library, you can move on to the next step

2. Open the config.js provided and change this into your own..
   ```javascript
   module.exports={
      consumer_key:         '...',
      consumer_secret:      '...',
      access_token:         '...',
      access_token_secret:  '...',
    }
   ```   
3. Modify this section with your format (must be unique)

   ```javascript
   var stream = T.stream('statuses/filter', { track: '#yourhashtag' }); 
   //modify #yourhashtag with your uniqueness
   
   ```
   You need to modify this too 
   
   ```javascript
   var teksMenu_2 = teksMenu_1.replace('#yourhashtag', '') 
   //this will delete your hashtag because it's not needed
   
   ```
   
4. Modify this section with your catalogue list

   
   ```javascript
   else if (parseInt(teksMenu[i].split(' ').pop()) < 100) {
                    
                   else if (tks === 'your menu identifier') {
                       
                        //if quantity more than 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2)) // render the quantity (string to integer)
                            var cal = price * n // ( price multiply quantity)
                            var namaMenu = 'Menu/Your Item Name'

                            //if the total is more than 1 million (in rupiah, if dollar change it on your own)
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' ' + namaMenu + ': Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // if not
                                txt = txt + '\n' + n + ' ' + namaMenu + ': Rp' + cal + '.000'
                            }

                            sum = sum + (cal)


                        } else { // if order's quantity below 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' ' + namaMenu + ': Rp' + cal + '.000'
                            sum = sum + (cal)
                        }
                    }
   
   ```
   - cal is the price 
   - n is the quantity
   - namaMenu is your catalogue name

   
5. Push it to Heroku or another cloud server.
   You can watch the tutorial here: https://www.youtube.com/watch?v=DwWPunpypNA
   
# License

Copyright (c) by Salsa Rahmadati (salsarahmadatii@gmail.com)
Any question or suggestion is welcome! <3
