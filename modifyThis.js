console.log("the bot is starting");

var Twit = require('twit');
var config = require('./config');


var T = new Twit(config);

//setting up stream to ngudangorder
var stream = T.stream('statuses/filter', { track: '#yourhashtag' }); //modify #yourhashtag with your uniqueness

stream.on('tweet', order)




function order(data, err) {
    //variable declaration
    
    var namaUser = data.user.name.replace('.',''); //this will give you the account's name (can't be modified)
    var status_id = data.id_str //this will give you the status id in order to reply a status (can't be modified)

    //tweet conversion ex:( "#ngudangorder shrimp bowl 7, mineral water 9" to ['shrimp bowl 7', 'mineral water 9']"
    var teksMenu_a = JSON.stringify(data.text);
    var teksMenu_1 = teksMenu_a.toLowerCase();
    var teksMenu_2 = teksMenu_1.replace('#ngudangorder', '')
    var teksMenu_b = teksMenu_2.replace('"', '')
    var teksMenu_c = teksMenu_b.replace('.', '')
    var teksMenu_3 = teksMenu_c.split(',')

    function hapusSpasiDepan(str) {
        if (!str) return str;
        return str.replace(/^\s+/g, '');
    }

    var teksMenu_4 = []

    for (var i = 0; i < teksMenu_3.length; i++) {
        teksMenu_4.push(teksMenu_3[i].replace('"', ''))
    }

    var teksMenu = []

    for (var i = 0; i < teksMenu_4.length; i++) {
        teksMenu.push(hapusSpasiDepan(teksMenu_4[i]))
    }


    // START PROCESS ====================================================================================

    var txt = 'Kak ' + namaUser + ' pesen Ngudang ya? Ini ya invoicenya' + '\n' + ' '; // change it with your own greeting message before the invoice
    var sum = 0;
    if (data.is_quote_status == true) {
        // Apparently if someone quote a tweet with hashtag provided, 
        // it will be proceed and we don't want it so we set this.
        return;
    } else if (data.is_quote_status == false) {
        
        
        if (teksMenu.length > 7) {
            tweetIt('your message', status_id)
           // example: tweetIt('sorry' + namaUser + ', you can't order more than 7 item, please try again', status_id)
            
            // When someone order menu more than 7 item, this bot will reply "sorry Salsa, you can't order more than 7 item, please try again"
            // you can change the quantity '7' to anything that you want
            // !! status_id and namaUser can't be modified !!
            
        }           
        
        else {
            
            // write your catalog's menu start from here
            
            for (var i = 0; i < teksMenu.length; i++) {

                var tks = teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" "))

                
                if (parseInt(teksMenu[i].split(' ').pop()) > 99) { // if the quantity more than 99, it will reply that the user can't order more than 99 items
                                                                   // you can modify this as you want
                    
                    txt = txt + '\n' +'Your Message'
                   // example:  txt = txt + '\n' + 'Sorry you can't order 100 items or more'

                }
                
                // write your menu start here
                
                else if (parseInt(teksMenu[i].split(' ').pop()) < 100) {
                    
                   else if (tks === 'your menu identifier') {
                       
                        //if quantity more than 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2)) // render the quantity (string to integer)
                            var cal = price * n // ( price multiply quantity)
                            var namaMenu = ' Ice Cream'

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
                    
                // EXAMPLE
                    else if (tks === 'chocolate ice cream' || tks === 'strawberry ice cream'|| tks== 'vanilla ice cream' || tks == 'stroberi ice cream' || tks === 'chocolatte ice cream') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n (//20 stands for 20.000)
                            var con = tks.substring(0, tks.indexOf(" ")) // stands for condition check if its strawberry, vanilla or chocolate
                            var namaMenu = con + ' Ice Cream' 

                           
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' ' + namaMenu + ': Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' ' + namaMenu + ': Rp' + cal + '.000'
                            }

                            sum = sum + (cal)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' ' + namaMenu + ': Rp' + cal + '.000'
                            sum = sum + (cal)
                        }
                    }


                   // Jif the ordered menu doesn't avail on your catalog
                    else {
                        //txt = txt + '\n' + 'Sorry ' + namaUser + ' the ' + teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" ")) + ' is not available.'
                        sum = sum
                    }

                    // END PROCESS ====================================================================================


                }

                //Summation and Tweet section
                // All of this were set in Indonesian format


            }

            if (sum >= 1000) {
                var result = txt + '\n' + ' ' + '\n' + 'Total: Rp' + String(sum).charAt(0) + '.' + String(sum).slice(1) + '.000,-'
                tweetIt(result, status_id)
            }

            else if (sum == 0) {
                var result = txt + '\n' + ' ' + '\n' + 'Total: Rp0,-'

                tweetIt(result, status_id)

            }
            else if (sum > 0 && sum < 1000) {
                var result = txt + '\n' + ' ' + '\n' + 'Total: Rp' + sum + '.000,-'

                tweetIt(result, status_id)
            }
        }
    }


// function to tweet <DONT CHANGE IT>
    function tweetIt(txt, statID) {
        var tweet = {
            status: txt,
            in_reply_to_status_id: statID,
            auto_populate_reply_metadata: true
        }

        T.post('statuses/update', tweet, tweeted);


        function tweeted(err, data, response) {
            if (err) {
                console.log("Something went wrong")
            } else {
                console.log("Posted!")
            }
        }

    }
}
