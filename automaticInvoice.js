console.log("the bot is starting");

var Twit = require('twit');
var config = require('./config');


var T = new Twit(config);

//setting up stream to ngudangorder
var stream = T.stream('statuses/filter', { track: '#ngudangorder' });

stream.on('tweet', order)




function order(data, err) {
    //variable declaration
    
    var namaUser = data.user.name.replace('.','');
    var status_id = data.id_str

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

    var txt = 'Kak ' + namaUser + ' pesen Ngudang ya? Ini ya invoicenya' + '\n' + ' ';
    var sum = 0;
    if (data.is_quote_status == true) {
        // Apparently if someone quote a tweet with hashtag provided, 
        // it will be proceed and I dont want it, so I set this
        return;
    } else if (data.is_quote_status == false) {
        // menu can't be more than 5 item so...
        if (teksMenu.length > 7) {
            tweetIt('Maaf kak ' + namaUser + ' saat ini pemesanan hanya diperbolehkan untuk 7 item, silakan dicoba lagi.', status_id)
        } 
        
        else if (teksMenu[0].substr(0, teksMenu[0].lastIndexOf(" ")) == 'all menu' || teksMenu[0].substr(0, teksMenu[0].lastIndexOf(" ")) == 'all item' || teksMenu[0].substr(0, teksMenu[0].lastIndexOf(" ")) == 'semuanya'){
            
            var cal = 1100 * parseInt(teksMenu[0].split(' ').pop())
            if (cal > 9999 && cal < 100000){
            tweetIt('Ya Allah kak ' +namaUser +', banyak banget, tapi SIAP KAK SIAAP totalnya Rp' + cal.toString().substr(0,2) +'.' + cal.toString().slice(2) + '.000 ya kak '+ namaUser+ '!', status_id)

            }

            else if (cal > 99999){
            tweetIt('Mending kak ' + namaUser + ' order catering aja kak', status_id)
            }
            

            else{
            tweetIt('Ya Allah kak ' +namaUser +', banyak banget, tapi SIAP KAK SIAAP totalnya Rp' + cal.toString().charAt(0) +'.' + cal.toString().slice(1) + '.000 ya kak '+ namaUser+ '!', status_id)
            }
        }             
        
        else {

            for (var i = 0; i < teksMenu.length; i++) {

                var tks = teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" "))

                // jika jumlah menu item > 99
                if (parseInt(teksMenu[i].split(' ').pop()) > 99) {

                    txt = txt + '\nMaaf pemesanan tidak bisa berjumlah 100 atau lebih.'

                }

                else if (parseInt(teksMenu[i].split(' ').pop()) < 100) {
                    //mineral water

                    if (tks === 'mineral water' || tks == 'air putih' || tks == 'ngudang mineral water' || tks === 'aqua') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 10 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Mineral Water: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Mineral Water: Rp' + 10 * n + '.000'
                            }

                            sum = sum + (10 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Mineral Water: Rp' + 10 * n + '.000'
                            sum = sum + (10 * n)
                        }
                    }


                    // shrimp bowl

                    else if (tks === 'shrimp bowl' || tks == 'ngudangkuy special shrimp bowl' || tks === 'ngudang shrimp bowl') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 50 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Shrimp Bowl: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Shrimp Bowl: Rp' + 50 * n + '.000'
                            }

                            sum = sum + (50 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Shrimp Bowl: Rp' + 50 * n + '.000'
                            sum = sum + (50 * n)
                        }
                    }

                    //kari udang

                    else if (teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" ")) === 'kari udang' || tks == 'Shrimp Curry' || tks == 'kare udang') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 40 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Kari Udang: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Kari Udang: Rp' + 40 * n + '.000'
                            }

                            sum = sum + (40 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Kari Udang: Rp' + 40 * n + '.000'
                            sum = sum + (40 * n)
                        }
                    }

                    //udang asam manis

                    else if (tks === 'udang asam manis') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 40 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Udang Asam Manis: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Udang Asam Manis: Rp' + 40 * n + '.000'
                            }

                            sum = sum + (40 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Udang Asam Manis: Rp' + 40 * n + '.000'
                            sum = sum + (40 * n)
                        }
                    }

                    //Nasi gorenng udang

                    else if (teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" ")) === 'nasi goreng udang' || tks == 'nasi goreng' || tks == 'nasgor') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 40 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Nasi Goreng Udang: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Nasi Goreng Udang: Rp' + 40 * n + '.000'
                            }

                            sum = sum + (40 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Nasi Goreng Udang: Rp' + 40 * n + '.000'
                            sum = sum + (40 * n)
                        }
                    }

                    //nasi udang santan

                    else if (teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" ")) === 'nasi udang santan') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 40 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Nasi Udang Santan: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Nasi Udang Santan: Rp' + 40 * n + '.000'
                            }

                            sum = sum + (40 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Nasi Udang Santan: Rp' + 40 * n + '.000'
                            sum = sum + (40 * n)
                        }
                    }


                    //Salad udang

                    else if (teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" ")) === 'salad udang') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 40 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Salad Udang: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Salad Udang: Rp' + 40 * n + '.000'
                            }

                            sum = sum + (40 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Salad Udang: Rp' + 40 * n + '.000'
                            sum = sum + (40 * n)
                        }
                    }


                    //Udang Saus Pedas

                    else if (teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" ")) === 'udang saus pedas' || tks == 'udang pedes') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 40 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Udang Saus Pedas: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Udang Saus Pedas: Rp' + 40 * n + '.000'
                            }

                            sum = sum + (40 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Udang Saus Pedas: Rp' + 40 * n + '.000'
                            sum = sum + (40 * n)
                        }
                    }

                    //Mie Goreng Udang

                    else if (teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" ")) === 'mie goreng udang' || tks == 'mie goreng') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 40 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Mie Goreng Udang: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Mie Goreng Udang: Rp' + 40 * n + '.000'
                            }

                            sum = sum + (40 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Mie Goreng Udang: Rp' + 40 * n + '.000'
                            sum = sum + (40 * n)
                        }
                    }

                    //Udang Blackpepper

                    else if (teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" ")) === 'udang blackpepper' || tks == 'udang blackpaper' || tks =='udang blackpeper' || tks =='blackpepper') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 40 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Udang Blackpepper: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Udang Blackpepper: Rp' + 40 * n + '.000'
                            }

                            sum = sum + (40 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Udang Blackpepper: Rp' + 40 * n + '.000'
                            sum = sum + (40 * n)
                        }
                    }

                    //Fettucini Udang

                    else if (tks === 'fettucini udang' || tks === 'fettucine udang' || tks === 'fettuccine udang') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 45 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Fettucini Udang: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Fettucini Udang: Rp' + cal + '.000'
                            }

                            sum = sum + (cal)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Fettucini Udang: Rp' + cal + '.000'
                            sum = sum + (cal)
                        }
                    }

                    //Aglio e olio

                    else if (teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" ")) === 'aglio e olio'|| tks === 'aglio olio' || tks ==='aglio') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 45 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Aglio E Olio: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Aglio E Olio: Rp' + 45 * n + '.000'
                            }

                            sum = sum + (45 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Aglio E Olio: Rp' + 45 * n + '.000'
                            sum = sum + (45 * n)
                        }
                    }

                    //Iced/Hot Sweet tea

                    else if (tks === 'iced sweet tea' || tks === 'hot sweet tea' || tks == 'ice sweet tea') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 10 * n

                            var con = tks.substring(0, tks.indexOf("s"))
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' ' + con + 'Sweet Tea: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' ' + con + 'Sweet Tea: Rp' + 10 * n + '.000'
                            }

                            sum = sum + (10 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' ' + con + 'Sweet Tea: Rp' + 10 * n + '.000'
                            sum = sum + (10 * n)
                        }
                    }

                    //Iced/Hot Lemonade

                    else if (tks === 'iced lemonade' || tks === 'hot lemonade' || tks == 'ice lemonade') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 10 * n

                            var con = tks.substring(0, tks.indexOf("l"))
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' ' + con + 'Lemonade: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' ' + con + 'Lemonade: Rp' + 10 * n + '.000'
                            }

                            sum = sum + (10 * n)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' ' + con + 'Lemonade: Rp' + 10 * n + '.000'
                            sum = sum + (10 * n)
                        }
                    }

                    //Iced/Hot Lemon Tea

                    else if (tks === 'iced lemon tea' || tks === 'hot lemon tea' || tks == 'ice lemon tea') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 15 * n

                            var con = tks.substring(0, tks.indexOf("l"))
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' ' + con + 'Lemon Tea: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' ' + con + 'Lemon tea: Rp' + cal + '.000'
                            }

                            sum = sum + (cal)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' ' + con + 'Lemon Tea: Rp' + cal + '.000'
                            sum = sum + (cal)
                        }
                    }


                    //Iced/Hot milk tea

                    else if (tks === 'iced milk tea' || tks === 'hot milk tea' || tks == 'ice milktea') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n

                            var con = tks.substring(0, tks.indexOf("l"))
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' ' + con + 'Milk Tea: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' ' + con + 'Milk tea: Rp' + cal + '.000'
                            }

                            sum = sum + (cal)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' ' + con + 'Milk Tea: Rp' + cal + '.000'
                            sum = sum + (cal)
                        }
                    }


                    //Iced/Hot Cappucino

                    else if (tks === 'iced cappuccino' || tks === 'hot cappuccino' || tks == 'ice cappuccino' || tks == 'iced cappucino' || tks == 'hot cappucino' || tks == 'ice cappucino' || tks == 'es cappucino') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n

                            var con = tks.substring(0, tks.indexOf(" "))
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' ' + con + 'Cappuccino: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' ' + con + 'Cappuccino: Rp' + cal + '.000'
                            }

                            sum = sum + (cal)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' ' + con + 'Cappuccino: Rp' + cal + '.000'
                            sum = sum + (cal)
                        }
                    }


                    //Iced/Hot Lychee Tea

                    else if (tks === 'iced lychee tea' || tks === 'hot lychee tea' || tks == 'ice lychee tea' || tks == 'es teh leci' || tks == 'es leci tea' || tks == 'ice leci tea' || tks == 'hot leci tea') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 25 * n

                            var con = tks.substring(0, tks.indexOf(" "))
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' ' + con + ' Lychee Tea: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' ' + con + ' Lychee Tea: Rp' + cal + '.000'
                            }

                            sum = sum + (cal)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' ' + con + ' Lychee Tea: Rp' + cal + '.000'
                            sum = sum + (cal)
                        }
                    }

                    //Nasi Putih

                    else if (tks === 'nasi putih' || tks === 'nas putih' || tks == 'nasi') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 10 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Nasi Putih: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Nasi Putih: Rp' + cal + '.000'
                            }

                            sum = sum + (cal)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Nasi Putih: Rp' + cal + '.000'
                            sum = sum + (cal)
                        }
                    }


                    //Kentang Goreng

                    else if (tks === 'kentang goreng' || tks === 'kentang' || tks === 'fried fries') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
                            if (cal >= 1000) {
                                txt = txt + '\n' + n + ' Kentang Goreng: Rp' + + String(cal).charAt(0) + '.' + String(cal).slice(1) + '.000'
                            } else { // jika ga lebih
                                txt = txt + '\n' + n + ' Kentang Goreng: Rp' + cal + '.000'
                            }

                            sum = sum + (cal)


                        } else { //jika pesanan kurang dari 10
                            n = parseInt(teksMenu[i].slice(-1))
                            txt = txt + '\n' + n + ' Kentang Goreng: Rp' + cal + '.000'
                            sum = sum + (cal)
                        }
                    }

                    //onion ring

                    else if (tks === 'onion ring' || tks === 'onion' || tks === 'onion rng') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n
                            var namaMenu = 'Onion Ring'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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

                    //garlic bread

                    else if (tks === 'garlic bread' || tks === 'garlic brad' || tks === 'grlic bread') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n
                            var namaMenu = 'Garlic Bread'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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


                    //mashed potatoes

                    else if (tks === 'mashed potato' || tks === 'mashed potatoes' || tks === 'mash potato') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n
                            var namaMenu = 'Mashed Potatoes'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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


                    //Cheesy/Original Bread Stick

                    else if (tks === 'cheesy bread stick' || tks === 'original bread stick') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n
                            var con = tks.substring(0, tks.indexOf(" "))
                            var namaMenu = con + ' Bread Stick'

                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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


                    //chicken wings

                    else if (tks === 'chicken wings' || tks === 'chicken wing' || tks === 'chicken win') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 25 * n
                            var namaMenu = 'Chicken Wings'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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


                    //mozzarella stick

                    else if (tks === 'mozzarella stick' || tks === 'mozza stick' || tks === 'mozarella stick' || tks == 'mozarela stick') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 25 * n
                            var namaMenu = 'Mozzarella Stick'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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

                    //pudding

                    else if (tks === 'puding' || tks === 'pudding' || tks === 'pudinh' || tks == 'pudung') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n
                            var namaMenu = 'Pudding'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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

                    //ice cream coklat/vanilla/stroberi

                    else if (tks === 'chocolate ice cream' || tks === 'strawberry ice cream'|| tks== 'vanilla ice cream' || tks == 'stroberi ice cream' || tks === 'chocolatte ice cream') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n
                            var con = tks.substring(0, tks.indexOf(" "))
                            var namaMenu = con + ' Ice Cream'

                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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


                    //cheesecake

                    else if (tks === 'cheesecake' || tks === 'ciskek' || tks === 'chessecake' || tks == 'chees cake') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 25 * n
                            var namaMenu = 'Cheesecake'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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

                    //ice cream aja

                    else if (tks === 'es krim' || tks === 'ice cream' || tks === 'es cream' || tks == 'ice creem') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 20 * n
                            var namaMenu = 'Ice Cream'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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

                    //tiramisu

                    else if (tks === 'tiramisu' || tks === 'tiramissu') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 25 * n
                            var namaMenu = 'Tiramisu'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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

                    //churros

                    else if (tks === 'churros' || tks === 'churro') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 25 * n
                            var namaMenu = 'Churros'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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

                     //druit tart

                     else if (tks === 'fruit tart' || tks === 'fruut tart') {
                        //jika jumlah pesanan lebih dari 9
                        if (parseInt(teksMenu[i].slice(-1)) >= 0 && parseInt(teksMenu[i].slice(-2)) > 0) {
                            n = parseInt(teksMenu[i].slice(-2))
                            var cal = 25 * n
                            var namaMenu = 'Fruit Tart'
                            //jika lebih dari sama dengan satu juta penulisannya 1.000.000
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


                    // Jika menu belum tersedia
                    else {
                        txt = txt + '\n' + 'Mohon maaf kak ' + namaUser + ' Menu ' + teksMenu[i].substr(0, teksMenu[i].lastIndexOf(" ")) + ' belum tersedia.'
                        sum = sum
                    }

                    // END PROCESS ====================================================================================


                }

                //Summation


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