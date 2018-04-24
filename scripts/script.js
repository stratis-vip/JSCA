    let pac = new Pace();
    let epilogeas = 0;
    $(document).ready(function() {
        $(document).on("PaceCalculateError", { foo: "bar" }, function(event, arg1, arg2) {
            switch (epilogeas) {
                case 1:
                    $('#resultCalcRythm').removeClass('bg-success').addClass('bg-danger').show();
                    $('#results-CalcRythm').text(arg1);

                    break;
                case 2:
                    $('#resultCalcTime').removeClass('bg-success').addClass('bg-danger').show();
                    $('#results-CalcTime').text(arg1);
                    break;
            }
            pac.errorMsg = arg2;

            console.log(pac.errorMsg); // "bar"
            console.log(arg1); // "bim"
            console.log(arg2); // "baz"
        });




        console.log("ready!");
        // $("#paceFromDistance").hide();
        $("input.CalcRythm").on('input', calculatePaceFromIput);
        $("input.CalcTime").on('input', calculateTimeFromIput);
        $("#showPaceFromDistance").on('click', function() {
            if ($("#paceFromDistance").is(":visible")) {
                $("#paceFromDistance").parent().slideUp().hide(0);
                $("#paceFromDistance").parent().parent().removeClass("margin-bottom-15");
            } else {
                $("#paceFromDistance").parent().slideDown();
                $("#paceFromDistance").parent().parent().addClass("margin-bottom-15");

            }
        });
        $("#showTimeFromPace").on('click', function() {
            if ($("#timeFromPace").is(":visible")) { $("#timeFromPace").parent().slideUp().hide(0); } else {
                $("#timeFromPace").parent().slideDown();
            }
        });
        $(".epik").on('click', closeOtherEpikefalides);

    });

    //function για να κλείνει όλες τις άλλες επικεφαλίδες

    function closeOtherEpikefalides() {
        $(".epik").not(this).next().slideUp().parent().removeClass('margin-bottom-15');
        //$(".epikef").not(this).slideUp().removeClass('margin-bottom-15');

    }

    function calculatePaceFromIput() {
        epilogeas = 1;
        pac.hours = Number($('#hours').val());
        pac.minutes = Number($('#minutes').val());
        pac.seconds = Number($('#seconds').val());
        pac.distance = Number($('#apostasi').val());
        pac.DecPace = pac.toDecimalPace();
        if (pac.errorMsg === 0) {
            $('#resultCalcRythm').addClass('bg-success').removeClass('bg-danger');
            $('#results-CalcRythm').html(
                pac.toString() + " (ΛΛ:ΔΔ:ΕΕ)<br />" + pac.toDecimalPace().toFixed(2) + " (Λεπτά/Χλμ)");
        }
    }

    function calculateTimeFromIput() {
        epilogeas = 2;
        var dis = Number($('#Rapostasi').val());
        var m = Number($('#Rminutes').val());
        var s = Number($('#Rseconds').val());
        if (m + s === 0 || dis === 0) {
            $(document).trigger("PaceCalculateError", ["Δεν έχει ορισθεί απόσταση ή (και) χρόνος.", 200]);
        } else {
            $('#resultCalcTime').addClass('bg-success').removeClass('bg-danger').show();
            let temp = (m + (s * 10 / 600)) * dis;
            $('#results-CalcTime').text(
                DecTimeToTime(temp));
        }

    }

    function DecTimeToTime(dTime) {
        let hourPart = Math.floor(dTime / 60);
        let apotelesma = "";
        if (hourPart < 10) { apotelesma += "0"; }
        apotelesma += hourPart + ":";
        dTime -= hourPart * 60;
        let minPart = Math.floor(dTime);
        if (minPart < 10) { apotelesma += "0"; }
        apotelesma += minPart + ":";
        dTime -= minPart;
        let secPart = Math.floor(dTime * 60);
        if (secPart < 10) { apotelesma += "0"; }
        apotelesma += secPart + ".";
        dTime = dTime * 60 - secPart;
        let milPart = Math.floor(dTime * 100);
        if (milPart === 0) { apotelesma += "00"; } else {
            if (milPart < 10) { apotelesma += "0"; } else { apotelesma += milPart; }
        }
        return apotelesma;
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