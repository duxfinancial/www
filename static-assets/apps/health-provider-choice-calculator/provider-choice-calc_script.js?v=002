
        //CUSTOM PROVIDER CALCULATOR
        //This script is local to this component only
        
        const hospitalAssBtn = document.querySelector('div[data-meta-tab="tab1"] button[data-label="hospital_assoc"]');
        const chronicStateBtn = document.querySelector('div[data-meta-tab="tab1"] button[data-label="chronic_state"]');

        document.addEventListener("DOMContentLoaded", function() {
            attach_customOptions_triggers();
            if (hospitalAssBtn) {
                hospitalAssBtn.click();
            }
            
            if (chronicStateBtn) {
                chronicStateBtn.click();
            }
            
        });

        function attach_customOptions_triggers() {
            let btn_list = document.querySelectorAll('.custom-options');

            for(let i = 0; i < btn_list.length; i++) {
                btn_list[i].onclick = function() {
                    initiate_customOptions(this);
                }
            }
        }

        let selection_one = document.querySelector('#selection-group--first .active').getAttribute("data-label"),
            selection_two = document.querySelector('#selection-group--second .active').getAttribute("data-label");

        function initiate_customOptions(target){
            //console.log(target.getAttribute("data-label"));
            let selection_group_one = document.querySelectorAll('#selection-group--first button');
            let selection_group_two = document.querySelectorAll('#selection-group--second button');
            let parent_el = target.parentNode.id;
           
            if(parent_el === "selection-group--first") {

                // if hospital_any or hospital_associated etc
                selection_one = target.attributes["data-label"].value;
            }else {

                // if chronic_any or chronic_associated etc
                selection_two = target.attributes["data-label"].value;
                
            }


            for(let i = 0; i < selection_group_one.length; i++) {
                                                                
/*                if (this.classList.contains("active")){
                        this.classList.remove("active");
                }*/
             

                if (target.getAttribute("data-label") == selection_group_one[i].getAttribute("data-label")) {
//                    selection_group_two[i].classList.add("active");
                    selection_group_one[i].click();
                }
                
                

            };

            for(let i = 0; i < selection_group_two.length; i++) {
                                                                
/*                if (this.classList.contains("active")){
                        this.classList.remove("active");
                }*/
             

                if (target.getAttribute("data-label") == selection_group_two[i].getAttribute("data-label")) {
//                    selection_group_two[i].classList.add("active");
                    selection_group_two[i].click();
                }
                
                

            };


            //remove active class on old selection
            target.parentNode.querySelector('.active').classList.remove("active");

            //add active class on current selection
            target.classList.add("active");


            //retrieve all pricing elements currently displayed and hide them
            let current_values = document.querySelectorAll('[data-option-group]:not(.d-none)');
            display_values(current_values, false);

            //retrieve which group of elements should be displayed
            let option_group = fetch_calculated_values(selection_one, selection_two);
    

            //retrieve elements in the specified group to be displayed to the user
            let new_values = document.querySelectorAll("[data-option-group='"+ option_group +"']");
            display_values(new_values, true, option_group);
        }


        function fetch_calculated_values(x, y){

            let value;

            switch (x){
                case "hospital_any" :
                    /*document.querySelector('div[data-meta-tab="tab1"] button[data-label="hospital_any"]').click();
                    document.querySelector('div[data-meta-tab="tab2"] button[data-label="hospital_any"]').click();
                    document.querySelector('div[data-meta-tab="tab3"] button[data-label="hospital_any"]').click();*/

                    switch (y){

                        case "chronic_any" :
                            value = 1;
                            break;
                        case "chronic_associated":
                            value = 2;
                            break;
                        case "chronic_state":
                            value = 3;
                            break;

                    }
                    break;
                case "hospital_assoc":
                    /*document.querySelector('div[data-meta-tab="tab1"] button[data-label="hospital_assoc"]').click();
                    document.querySelector('div[data-meta-tab="tab2"] button[data-label="hospital_assoc"]').click();
                    document.querySelector('div[data-meta-tab="tab3"] button[data-label="hospital_assoc"]').click();*/
                    switch (y){

                        case "chronic_any" :
                            value = 4;
                            break;
                        case "chronic_associated":
                            value = 5;
                            break;
                        case "chronic_state":
                            value = 6;
                            break;

                    }
                    break;
            }

            return value;
        }

        function display_values(obj, display, group) {

            for (let i = 0; i < obj.length; i++) {

                if (!display) {
                    obj[i].classList.add("d-none");
                } else {
                    obj[i].classList.remove("d-none");
                }
            }

            //for values in bottom description
             /* if (display) {

              document.querySelector("#value_description span").classList.add("d-none");

                if (group !== 1) {
                    document.getElementById("value_description").classList.remove("d-none");
                    document.querySelector("#value_description [data-option-group='"+ group +"']").classList.remove("d-none");

                } else {
                    document.getElementById("value_description").classList.add("d-none");
                }
            }*/

        }
