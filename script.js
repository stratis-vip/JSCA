    let pac = new Pace();
    $(document).ready(function() {
        $(document).on("PaceCalculateError", { foo: "bar" }, function(event, arg1, arg2) {
            $('#result').removeClass('w3-green').addClass('w3-red').show();
            $('#t').text(arg1);
            pac.errorMsg = arg2;

            console.log(pac.errorMsg); // "bar"
            console.log(arg1); // "bim"
            console.log(arg2); // "baz"
        });




        console.log("ready!");
        // $("#paceFromDistance").hide();
        $("input").on('change', calculatePaceFromIput);
        $("#showPaceFromDistance").on('click', function() {

            if ($("#paceFromDistance").is(":visible")) { $("#paceFromDistance").slideUp(); } else { $("#paceFromDistance").slideDown(); }
        })
    });
    /*
    $(document).ready(function(){
        /*
        

    });
    */

    function calculatePaceFromIput() {

        pac.hours = Number($('#hours').val());
        pac.minutes = Number($('#minutes').val());
        pac.seconds = Number($('#seconds').val());
        pac.distance = Number($('#apostasi').val());
        pac.DecPace = pac.toDecimalPace();
        if (pac.errorMsg === 0) {
            $('#result').addClass('w3-green').removeClass('w3-red');
            $('#t').html(
                pac.toString() + " (ΛΛ:ΔΔ:ΕΕ)<br />" + pac.toDecimalPace().toFixed(2) + " (Λεπτά/Χλμ)");
        }
    }

    /* Object Pace*/
    function Pace(hour, minute, second, distance) {
        //Έλεγξε τις αρχικές τιμές και μηδένισε τες όταν δεν ορίζονται
        if (hour === undefined) {
            this.hours = 0;
        } else {
            this.hours = hour;
        }

        if (minute === undefined) {
            this.minutes = 0;
        } else {
            this.minutes = minute;
        }
        if (second === undefined) {
            this.seconds = 0;
        } else {
            this.seconds = second;
        }
        if (distance === undefined) {
            this.distance = 0;
        } else {
            this.distance = distance;
        }
        this.DecPace = NaN;
        this.errorMsg = 0;
        //εμφάνιση του ρυθμού
        this.toString = function() {
            let apotelesma = "";
            if (this.distance !== 0 && this.checkTime()) {
                let signature = "";
                if (this.hours < 10) {
                    signature += "0";
                }
                signature += this.hours + ":";
                if (this.minutes < 10) {
                    signature += "0";
                }
                signature += this.minutes + ":";
                if (this.seconds < 10) {
                    signature += "0";
                }
                signature += this.seconds;
                let dpace = this.toDecimalPace();
                let intPart = Math.floor(dpace);
                let decPart = (dpace - intPart) * 100;
                let paceString = "";
                if (intPart < 10) {
                    paceString += "0";
                }
                paceString += intPart + ":";
                let temp = 0.6 * decPart;
                let milPart = temp - Math.floor(temp);
                decPart = Math.round(0.6 * decPart);
                if (decPart < 10) {
                    paceString += "0";
                }
                paceString += decPart + "." + Math.floor(milPart * 100);
                apotelesma = paceString;

            } else {

                apotelesma = "";
            }
            return apotelesma;
        };

        this.toDecimalPace = function() {
            if (this.distance !== 0 && this.checkTime()) {
                if (pac.errorMsg === 100) { pac.errorMsg = 0; }
                return ((this.hours * 60 + this.minutes + (this.seconds / 60)) / this.distance);
            } else {
                $(document).trigger("PaceCalculateError", ["Δεν έχει ορισθεί απόσταση ή (και) χρόνος.", 100]);
                return NaN;
            }
        };

        this.checkTime = function() {
            if ((this.hours + this.minutes + this.seconds) === 0) { return false; } else { return true; }

        };
    }