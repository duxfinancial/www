
        document.addEventListener("DOMContentLoaded", function() {

            if (isMobileDevice.Default()) {

                try {
                    tabiFyer();
                }
                catch(e) {
                    console.info(e);
                }

            }
        });

        function tabiFyer(setDefaultTab) {
            tabTrigger(setDefaultTab);
        }


        function tabTrigger(defaultTab) {
            var defaultTabval = defaultTab;
            var tab_triggers = document.querySelectorAll("*[data-meta-tabid]");

            for (var i = 0 ; i < tab_triggers.length; i++) {
                tab_triggers[i].onclick = function () {
                    var this_tab = this.getAttribute("data-meta-tabid");
                    tabViewer(this_tab);
                }

                if (defaultTabval !== undefined && defaultTabval !== "") {
                    if (tab_triggers[i].getAttribute("data-meta-tabid") === defaultTab) {
                        tab_triggers[i].click(tabViewer(defaultTab));
                    }

                }
                else {
                    if (i === tab_triggers.length - 1) {
                        tab_triggers[0].click(tabiFyer(tab_triggers[0].getAttribute("data-meta-tabid")));
                    }
                }
            }
        }

        function tabViewer(tab_element) {
            var tab_panels = document.querySelectorAll("*[data-meta-tab]");
            var tab_id = tab_element;
            for (var i = 0 ; i < tab_panels.length; i++) {
                tab_panels[i].classList.add("d-none");
                if (tab_panels[i].getAttribute("data-meta-tab") === tab_id) {
                    tab_panels[i].classList.remove("d-none");
                }
            }
        }

        var isMobileDevice = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            Default: function() {
                return navigator.userAgent.match(/mobile/i);
            }
        };
    


    
        function toggle_container (wrapper, e) {
            var target_el = document.getElementById(wrapper),
                el_class_list = target_el.classList,
                target_class = "d-none",
                btn_text = e.querySelector(".mdc-button__text"),
                icon = e.querySelector(".mdc-button__icon");

            if (el_class_list.contains(target_class)){
                target_el.classList.remove(target_class);
                icon.innerHTML = "expand_less";
                btn_text.innerHTML = "Hide select options";
            }else{
                target_el.classList.add(target_class);
                icon.innerHTML = "expand_more";
                btn_text.innerHTML = "Show select options";
            }

        }
    


    
        ////////////////////
        //GLOBAL VARIABLES //
        var compare_object = {};
        var category_group;
        var select_options = [];
        var sorted_grouped_benefits = [];
        var col1_html = [];
        var col2_html = [];

        ////////////////////

        $(document).ready(function(){

                $(".m-tron__overlay").removeClass("d-none");

               /* $.getJSON("/wps/portal/client/caas?current=true&urile=wcm:path:momentum-client-content-lib-en/Pages/caas/reference-data-2025&mime-type=application/json&pagedesign=momentum-client-design-lib-en/caas/reference-data-compare-table", function (data) {*/

                $.getJSON("/static-assets/apps/medical-aid-compare-app/2026/compare.json", function (data) {
                    compare_object = data;
                }).fail(function (e) {
                    console.log(e);

                    var error_message = "";

                    if (e.status === 404) {
                        error_message = "Service unavailable at the moment, try again later.";
                    } else {
                        error_message = "We are experiencing technical error, try again later";
                    }

                    $("#error_box p").html(error_message);
                    $("#error_box").removeClass("d-none");

                }).always(function () {
                    $(".m-tron__overlay").addClass("d-none");
                });
                check_previous_state();
                adjust_select_width();

        });

        function expanderInit(){

                // Get all elements with the class "collapsible"
            var coll = document.getElementsByClassName("collapsible");

            // Add click event listeners to each element
            for (var i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function() {
                    this.classList.toggle("active"); // Toggle the "active" class
                    var parent = this.parentElement; // Get the next sibling (the collapsible content)
                    var content = this.nextElementSibling; // Get the next sibling (the collapsible content)
                    parent.classList.toggle("active");
                    content.classList.toggle("open");
                    if (content.classList.contains("open")) {
                        
                        this.querySelector(".mdc-expander__indicator").textContent = "expand_less";    
                        //content.style.display = "none"; // Hide the content
                    } else {
                        
                        this.querySelector(".mdc-expander__indicator").textContent = "expand_more";
                        //content.style.display = "block"; // Show the content
                    }
                });
            }


        }

        function adjust_select_width(){
            var select_width = "width:" + $("#compare-option-selector .mdc-select").width() + "px";

            $(".mdc-select__menu--width").attr("style",select_width);
        }

        function check_previous_state() {
            var selects = $("#compare-option-selector select");
            var $compareSection = $("#compare");
            select_options = [];

            //this is to make sure when you redirected back to the page, the material labels are hidden  and our select_options array is populated with selected ready to be compared
            $.each(selects, function (i, ctrl) {
                if(ctrl.value !== ""){

                    $(ctrl).closest(".grid__cell").find(".mdc-floating-label").addClass("d-none");
                    select_options.push({value: ctrl.value, id: ctrl.id});
                }

            });
            if ($compareSection.length > 0) {
                $("html, body").animate({scrollTop: $("#compare").offset().top - 80}, 0);
            }
        }

        function reset_error_state(ctrl){
            //check if more than one option has been selected, if so display compare button

            ctrl.find(".grid__cell").find(".error-label").addClass("d-none");
            ctrl.find(".grid__cell").removeClass("motion-error");
            ctrl.find(".grid__cell").find(".material-icons").addClass("d-none");
            ctrl.find(".grid__cell").find(".mdc-select__dropdown-icon").removeClass("d-none");
            ctrl.find(".grid__cell").find(".mdc-line-ripple").attr("style","z-index:2");
            $("#btn-compare").find("button").removeAttr("disabled");
            $("#btn-compare .motion-error").addClass("d-none");
        }

        function changeOption(obj){

            var thisSelect = $(obj),
                selected_value = thisSelect.attr("data-value"),
                active_select_id = $(obj).closest(".mdc-select__menu").attr("data-for");

            select_options = [];

            reset_validation_state(active_select_id);

            var selects = $("#compare-option-selector .mdc-select input");

            //check which options are already selected, then pushes them into the array
            $.each(selects, function (i, ctrl) {

                if(active_select_id !== ctrl.id){
                    if(ctrl.value !== ""){
                        select_options.push({value: ctrl.value, id: ctrl.id});
                    }
                }

            });

            //checks the array if the current select value already exists in the array
            for(var x = 0;x < select_options.length;x++){


                if(select_options[x].value === thisSelect.attr("data-value")){

                    //on validation fail, check to disable the non-selected control (valid for initial iteration)
                    disable_control_selections(active_select_id);

                    active_select_id = "#" + active_select_id;
                    $(active_select_id).closest(".grid__cell").addClass("motion-error").find(".error-label").removeClass("d-none");
                    $(active_select_id).closest(".grid__cell").find(".mdc-line-ripple").attr("style","z-index:-1");
                    $(active_select_id).closest(".grid__cell").find(".material-icons").removeClass("d-none");
                    $(active_select_id).closest(".grid__cell").find(".mdc-select__dropdown-icon").addClass("d-none");

                    //$("#compare_results").addClass("d-none");
                    $("#btn-compare").find("button").attr("disabled","disabled");
                    //$("#compare-option-selector .mdc-select").addClass("mdc-select--disabled");



                    for(var p = 0;p < select_options.length;p++){
                        var select_ctrl = select_options[p].id;
                        if(select_options[x].value !== select_options[p].value){
                            $(document.getElementById(select_ctrl).parentElement).addClass("mdc-select--disabled");
                        }
                        else{
                            $(document.getElementById(select_ctrl).parentElement).removeClass("mdc-select--disabled");
                        }
                    }


                    return;
                }
            }

            if(selected_value === "") {
                $("#"+active_select_id).closest(".mdc-select").find(".mdc-floating-label").removeClass("d-none");
            }
            else{
                //if not, at this point it pushes this value into the array as a already selected option
                select_options.push({value: selected_value, id: active_select_id});
            }

            //proceed to display compare cta
            displayValidationChecks();

        }

        $(".mdc-select__menu ul li").on("click", function(){
            changeOption($(this)); 

        /* Apply change to selection dropdowns to auto trigger the compare on each selection */
        const plan_selectors = document.querySelectorAll('.mdc-select');
        for (var i = 0; i < plan_selectors.length; i++) {
             plan_selectors[i].addEventListener('MDCSelect:change', function(event) {  
                    compare_options();
                });
         }

      if($('#compare-option-selector .mdc-select--position-fixed').length > 0) {
                post_selection_action();
            }
        });



        function reset_validation_state(thisSelect) {
            reset_error_state($("#compare-option-selector"));
            thisSelect = "#" + thisSelect;

            $(thisSelect).closest(".mdc-select").find(".mdc-floating-label").addClass("d-none");
        }

        function disable_control_selections(thisCtrl){
            var selects = $("#compare-option-selector .mdc-select input");

            $.each(selects, function (i, ctrl){
                if(ctrl.value === "" && ctrl.id !== thisCtrl){
                    ctrl.parentElement.classList.add("mdc-select--disabled");
                }
            });
        }

        function displayValidationChecks(){

            //if 2 or more options selected then display
            if(count_selected_options()){
                $("#btn-compare").removeClass("d-none");
            }else{
                $("#compare_results").addClass("d-none");
            }

            //checks if all selects pass validation then enable them
            if(verify_option_validation() ){
                $("#mdc-select-compare-3, #mdc-select-compare-2, #mdc-select-compare-1").closest(".mdc-select").removeClass("mdc-select--disabled");
            }
        }

        function count_selected_options(){

            var state = false;

            if(select_options.length > 1){
                state = true;

            }

            return state;
        }

        function verify_option_validation() {
            var valid = true;

            for(var a = 0;a < select_options.length;a++) {
                var item = select_options[a];
                var self_index = a;

                for (var b = 0; b < select_options.length; b++) {
                    if (item === select_options[b] && self_index !== b) {
                        valid = false;
                    }
                }
            }
            return valid;
        }



        function compare_options(){
            if(!count_selected_options()){
                $("#btn-compare .motion-error").removeClass("d-none");
                return;
            }

            var option1 = $("#mdc-select-compare-1").val(),
                option2 = $("#mdc-select-compare-2").val(),
                option3 = $("#mdc-select-compare-3").val();

            document.getElementById("compare_results").classList.remove("d-none");

            populate_tab_labels(option1, option2, option3);

            populate_option_overview(compare_object, option1,option2,option3);
            populate_option_benefits(compare_object, option1,option2,option3);
            populate_option_buttons(compare_object, option1,option2,option3);

            if($(window).width() < 1284){
                tabTrigger("");
                $("html, body").animate({ scrollTop: $("#compare_results").offset().top - 80}, 1000);
            }

            //different layout for 2 options vs 3
            if(select_options.length === 2){
                /*$("#compare-options-overview, #compare-options-details section .grid__inner").removeClass("grid__inner--layout-444").addClass("grid__inner--layout-66");*/
                /*$("#compare-options-details section .grid__inner").addClass("grid__inner--layout-66");*/

            }else{
                /*$("#compare-options-overview, #compare-options-details section .grid__inner,#compare-options-details div .grid__inner").removeClass("grid__inner--layout-b44b").addClass("grid__inner--layout-444");*/

                /*$("#compare-options-details section .grid__inner,#compare-options-details div .grid__inner").removeClass("grid__inner--layout-b44b").addClass("grid__inner--layout-444");*/

            }

        }

        function populate_tab_labels(option1, option2, option3){

            var meta_id, label;
            $.each($(".mdc-compare-tabs button"), function (i, btn) {

                switch ($(this).attr("id")) {
                    case "mdc-tab-1":
                        if(option1 === "") {
                            $(this).addClass("d-none");
                        }
                        else {
                            meta_id = option1;
                            label = $("#mdc-select-compare-1").closest(".mdc-select").find(".mdc-select__selected-text").html();
                            $(this).removeClass("d-none");
                        }
                        break;
                    case "mdc-tab-2":
                        if(option2 === "") {
                            $(this).addClass("d-none");
                        }
                        else {
                            meta_id = option2;
                            label = $("#mdc-select-compare-2").closest(".mdc-select").find(".mdc-select__selected-text").html();
                            $(this).removeClass("d-none");
                        }
                        break;
                    case "mdc-tab-3":
                        if(option3 === "") {
                            $(this).addClass("d-none");
                        }
                        else{
                            meta_id = option3;
                            label = $("#mdc-select-compare-3").closest(".mdc-select").find(".mdc-select__selected-text").html();
                            $(this).removeClass("d-none");
                        }
                }

                $(this).attr("data-meta-tabid", meta_id);
                $(this).find(".mdc-tab__text-label").text(label);

            });

        }
        function populate_option_overview(object, option1,option2,option3) {

            var html_items, column1 = "", column2 = "", column3 = "";

            $.each(object, function (i, item) {

                var html = "";
                console.log("brochureLink:" + item.brochureLink);
                if (option1 === item.id || option2 === item.id || option3 === item.id) {

                    html += "<div data-meta-tab='" + item.id + "' class='grid__cell grid__cell--align-stretch bg-white p-4'>"
                        + "<h3 class='mdc-typography--headline4 text--weight-black'>" + item.heading + "</h3>"
                        + "<p class='mdc-typography--body2 mb-2'>" + item.description
                        + "</p>"
                        + "<p class='mdc-typography--headline4 text--weight-black'><span class='mb-1 mdc-typography--caption'>from</span> R" + item.amount + " <span class='mb-1 mdc-typography--caption'>per month</span></p>"
                        + "<div class='mdc-btn-container'>"
                        + "<a href='" + item.quoteLink + "' class='mdc-button mdc-button--raised motion-button--medium mdc-ripple-upgraded'>Get an online quote</a>"
                        + "<a target='_blank' href='" + item.brochureLink + "' class='mdc-button mdc-button--outlined mdc-ripple-upgraded motion-button--medium'>" + item.brochureLinkLabel + "</a>"
                        + "</div>"
                        + "</div>";
                }

                switch (item.id){
                    case option1:
                        column1 = html;
                        break;
                    case option2:
                        column2 = html;
                        break;
                    case option3:
                        column3 = html;
                        break;
                }

            });

            /* CDM-1600 - health revamp - UI changes - remove 3rd column */
            /*html_items = column1 + column2 + column3;*/

            html_items = column1 + column2;

            $("#compare-options-overview").html("").append(html_items);
        }


        function populate_option_benefits(object, option1,option2,option3) {

            var all_benefits=[], display_order = 0;

            $.each(object, function (i, item) {

                if (option1 === item.id || option2 === item.id || option3 === item.id) {

                    switch (item.id){
                        case option1:
                            display_order = 1;
                            break;
                        case option2:
                            display_order = 2;
                            break;
                        case option3:
                            display_order = 3;
                            break;
                    }

                    //retrieve all the benefits for the selected options to be sorted later  and grouped for each category
                    for(var x=0; x < item.benefits.length; x++){

                        //use html_row and html_col
                        all_benefits.push({id: item.id, category: item.benefits[x].name, summary: item.benefits[x].summary, icon: item.benefits[x].image, color: item.benefits[x].color, desc: item.benefits[x].covers, discl: item.benefits[x].disclaimer, html_col :display_order});
                    }
                }
            });

            //Get unique benefit categories (groupings) from all the benefits returned above
            var benefit_categories = [];
            get_group_Categories(all_benefits,benefit_categories);
            category_group = benefit_categories;

            consolidate_benefits(all_benefits, category_group);
        }

        function populate_option_buttons(object, option1,option2,option3) {

            var html_items_col1, html_items_col2, column1 = "", column2 = "", column3 = "";

            $.each(object, function (i, item) {

                var html = "";

                //if (option1 === item.id || option2 === item.id || option3 === item.id) {
                
                if (option1 === item.id || option2 === item.id ) {

                    html += "<div data-meta-tab='" + item.id + "' class='grid__cell grid__cell--align-stretch'>"
                        //+ "<div class='mdc-btn-container'>"
                        + "<a target='_blank' href='" + item.brochureLink + "' class='mdc-button mdc-button--outlined mdc-ripple-upgraded motion-button--medium'>" + item.brochureLinkLabel + "</a>"
                        //+ "<a href='" + item.callmebackLink + "' class='mdc-button mdc-button--raised mdc-ripple-upgraded motion-button--medium'>" + item.quoteLinkLabel + "</a>"
                        //+ "</div>"
                        + "</div>";
                }

                switch (item.id){
                    case option1:
                        column1 = html;
                        break;
                    case option2:
                        column2 = html;
                        break;
                    case option3:
                        column3 = html;
                        break;
                }
                console.log("id:" + item.id);
                
                
            });
            
            html_items_col1 = column1;
            html_items_col2 = column2;
                 
          /*  $("#compare-options-overview [data-meta-tab='evolve-option'] .mdc-btn-container").append("" + html_items_col1 + "");
            $("#compare-options-overview [data-meta-tab='incentive-option'] .mdc-btn-container").append("" + html_items_col2 + "");*/
            
            

            /* CDM-1600 - health revamp - UI changes - remove 3rd column */
            /*html_items = column1 + column2 + column3;*/

            
            /* CDM-1600 - health revamp - UI changes */
            
           
        }

        function get_group_Categories(arr,catGroup) {
            for(var a = 0; a < arr.length; a++)
            {
                if(catGroup.indexOf(arr[a].category) < 0)
                {
                    catGroup.push(arr[a].category);
                }
            }
        }


        function consolidate_benefits(unsorted_list,groups) {

            var consolidated_list = [];

            $.each(groups, function (i, group) {

                $.each(unsorted_list, function (x, item) {

                    //consolidate list via category group
                    if(group === item.category){

                        for (var i=0; i < item.desc.length; i++) {
                            consolidated_list.push({html_row: i, id: item.id, name: item.desc[i].name, desc: item.desc[i].description, html_col: item.html_col, category: item.category, icon: item.icon, color: item.color, summary: item.summary, disclaimer: item.discl, display: item.desc[i].heading_display });
                        }
                    }
                });

            });

            //sort list via html row order to display for each category group --- this is required due to how the html grid cell structure is being written out
            consolidated_list.sort(
                function(a, b) {
                    if (a.category === b.category) {

                        return a.html_row - b.html_row;
                    }
                    return a.category > b.category ? 1 : -1;
                });

            //NOW we display our benefits
            display_benefits(consolidated_list);
            
        }

        function display_benefits(obj) {
            var grouped_benefits;
            
            //create an object with benefits arrays grouped via categories
            grouped_benefits = obj.reduce(function (r, a) {
                r[a.category] = r[a.category] || [];
                r[a.category].push(a);
                return r;
            }, Object.create(null));

            

            //order the above objects as per our group categories list

            sortBenefits (grouped_benefits, category_group, sorted_grouped_benefits);
            //console.log(sorted_grouped_benefits);
            
          /* $.each(sorted_grouped_benefits, function (i, item) {
                console.log("benefit_name:" + item[i].name);
                console.log("benefit_desc:" + item[i].desc);
           });*/
            populate_ui(sorted_grouped_benefits);
            expanderInit();

        }

        function populate_ui(benefitsGroup){

            $("#compare-options-details").html("");

            $.each(benefitsGroup, function (x, group) {
                
                
                var html="", html_div = "", outer_container = "", category_icon = "", category_summary = "", category_disclaimer = "", category_color = "",  category_header = "", coverheader_display = "";
                var row_count = 0;
                var column1 = "", column2 = "", column3 = "";

               
                $.each(group, function (i, item) {
                    
                    //console.log("benefit_item:" + item.desc);
                   // console.log("benefit_id:" + group[i].id);
                    //console.log("benefit_name:" + group[i].name);
                   // console.log("benefit_desc:" + group[i].desc);
                    
                    ///console.log($.inArray(item.desc, group, i + 1) !== -1);
                        //if ($.inArray(item, group, i + 1) !== -1) {
                             
                           // console.log("duplicate found:" + group[i].desc);
                            //console.log("duplicate found:");
                            /*if ($.inArray(value, duplicates) === -1) {
                                duplicates.push(value);
                            }*/
                        //}
                

                    
                    
                    //console.log(group[i].name);
                    category_icon =  item.icon;
                    category_header = item.category;
                    category_summary = item.summary;
                    category_disclaimer = item.disclaimer;
                    category_color = item.color;
                    cover_desc = item.desc;
                    coverheader_display = item.display;
                    
                    
                    html = "";
                    if(item.html_row !== row_count ){
                        row_count = item.html_row;
                        html = "";
                        outer_container +=  html_div;
                        html_div = "";
                    }

                    html += "<div data-meta-tab='" + item.id + "' class='grid__cell grid__cell--align-stretch'>";

                    /* if(item.html_row !== 0){
                        html += "<hr>";
                    }*/
                    console.log("cat_header:" + category_header);
                    
                    if(category_header === "Health Platform Benefit") { 
                        
                        html += "<h3 class='mdc-typography--subtitle1 d-none'>" + item.name + "</h3>"
                        + item.desc
                        + "</div>";  
                        
                    }
                    else {
                        
                    html += "<h3 class='mdc-typography--subtitle1 d-none'>" + item.name + "</h3>"
                        + "<p class='mdc-typography--body1 mb-2'>" + item.desc
                        + "</p>"
                        + "</div>";  
                        
                    }
                    
                    
                    
   /*                 function prevItem(item) { 
                            return group[($.inArray(item, group) - 1 + group.length) % group.length];
                    } 
                  */
                    
                    /*if (this.desc == (group[i - 1])) {
                        console.log("item equal:" + group[i].desc);
                    }
                    else {
                        console.log("item:" + item.desc);
                    } */
                    
                    //console.log("item:" + group[i].desc);
                   // console.log("item_desc:" + cover_desc);
                    switch (item.html_col){
                        case 1:
                            column1 = html;
                            //col1_html = $.parseHTML(column1);             
                            break;
                        case 2:
                            column2 = html;
                            //col2_html = $.parseHTML(column2);
                            break;
                        /*case 3:
                            column3 = html;
                            break;*/
                    }

                    html = "";
                    
                   /* col1_html[i].push($.parseHTML(column1));
                    col2_html[i].push($.parseHTML(column2));
                   
                    console.log("col1_item:");
                    console.log(col1_html);
                    console.log("col2_item:");
                    console.log(col2_html);*/
                    
                    /*console.log(col1_html[i]);
                    console.log(col2_html[i]);*/
                    
         /*       col1_html = $.parseHTML(column1);
                col2_html = $.parseHTML(column2);
                console.log(col1_html[x]);
                console.log(col2_html[x]);*/
                    
                    /* CDM-1600 - health revamp - UI changes - remove 3rd column */
                    /*html_div = "<div class='text--align-center'><h3 class='mdc-typography--subtitle1 bg-white pt-1 pb-1 bb-1-motion-grey'>" + item.name + "</h3></div><div class='grid__inner grid__inner--layout-444'>" + column1 + column2 + column3 + "</div>";*/
                    

                    /*col1_html = $.parseHtml(column1); 
                    col2_html = $.parseHtml(column2); */
                    
                    /*console.log("col1: " + );
                    console.log("col2: " + $.parseAsHtml.parseFromString(column2, "text/html"));*/
                  
                    
                    //console.log("summary: " + category_summary);
                    if(category_header === "Hello Doctor") {
                        
                        //console.log(category_header); 
/*                        html_div = "<div class='text--align-center'><h3 class='mdc-typography--subtitle1 pt-1 pb-1 bb-1-motion-grey'>" + item.name + "</h3></div><div class='grid__inner grid__inner--layout-12'><div class='grid__cell'>" + category_summary + "</div></div><div class='grid__inner grid__inner--layout-66'>" + column1 + "</div>";*/
                        html_div = "<div class='text--align-center'><h3 class='mdc-typography--subtitle1 pt-1 pb-1 mb-0 bb-1-motion-grey d-none'>" + item.name + "</h3></div><div class='mdc-expander__content--item grid__inner grid__inner--layout-12 p-2'>" + column1 + "</div>";

                    }
                    else {
                      
                        
                        if (coverheader_display === "hidden") {
                          html_div = "<div class='text--align-center'><h3 class='mdc-typography--subtitle1 mb-0 bb-1-motion-grey'></h3></div><div class='mdc-expander__content--item grid__inner grid__inner--layout-66 p-2'>" + column1 + column2 + "</div>";   
                        }
                        else {   
                          
                            /*column1.html;
                            console.log(column1);*/
                          html_div = "<div class='text--align-center " + category_color + "--xtralight'><h3 class='mdc-typography--subtitle1 pt-1 pb-1 mb-0 bb-1-motion-grey'>" + item.name + "</h3></div><div class='mdc-expander__content--item grid__inner grid__inner--layout-66 p-2'>" + column1 + column2 + "</div>";  
                        }
                        
                        /*html_div = "<div class='text--align-center " + category_color + "--xtralight'><h3 class='mdc-typography--subtitle1 pt-1 pb-1 mb-0 bb-1-motion-grey'>" + item.name + "</h3></div><div class='mdc-expander__content--item grid__inner grid__inner--layout-66 p-2'>" + column1 + column2 + "</div>";    
                        */
                    }
                    

                });


                /*console.log(column1);
                console.log(column2);*/
                
                outer_container +=  html_div;

                //console.log(category_disclaimer);
                /* CDM-1600 - health revamp - UI changes*/
                /*var section_header = "<div class='text--align-center test'>"
                    + "<img class='motion-picture--responsive mt-2' src='https://sls-fresco.momentum.co.za/files/images/svg/" + category_icon + "' alt='Extra domum'>"
                    +"<p class='mdc-typography--headline6 mb-4'>" + category_header + "</p>"
                    +"</div>";*/
                /*console.log("benefit:" + category_header);
                console.log("benefit_color:" + category_color);*/
                var section_header = "<a class='mdc-expander__trigger " + category_color + " collapsible mdc-list-item mdc-theme--text-primary-on-dark border-radius-24 mdc-ripple-upgraded' href='javascript:void(0)' id='expander-1_trigger' role='tab' aria-expanded='' aria-controls=''>"
                    +"<h3 class='mdc-expander__trigger-text mdc-theme--text-primary-on-dark'>" + category_header + "</h3>"
                    +"<span class='mdc-expander__indicator mdc-list-item__meta material-icons' aria-hidden='true'>expand_more</span>"
                    +"</a>";
                
                    if (typeof category_disclaimer !== 'undefined' && category_disclaimer) {
                       var section_disclaimer = "<div class='text--align-center'><h3 class='mdc-typography--subtitle1 mb-0 bb-1-motion-grey'></h3></div><div class='grid__inner grid__inner--layout-12 p-2 text--align-center'><div class='grid__cell mdc-typography--caption'>" + category_disclaimer + "</div></div>" 
                    }
                    else {
                        var section_disclaimer = "";
                    }

                $("#compare-options-details").append("<section class='grid__cell mdc-expander mdc-expander--regular mdc-expander--rounded dynamic bg-white mb-0 mt-2' id='regular-expander-" + row_count + "'><div class='mdc-expander__item mdc-list'>" + section_header + "<div class='mdc-expander__content' id='expander-1_content'><div class='grid__inner grid__inner--layout-12 p-2 text--align-center'><div class='grid__cell mdc-typography--headline6'>" + category_summary + "</div></div>" + outer_container + section_disclaimer + "</div></div></div></section>");

                outer_container = "";

            });
        }

        function sortBenefits(benefits, group, arr) {

            var group_arr;
            arr = [];

            for(var x=0; x < group.length; x++)
            {
                group_arr = benefits[group[x]];
                arr.push(group_arr);
            }

            sorted_grouped_benefits = arr;

        }

    

    $('.mdc-select').on('click', function(event) {
      event.stopPropagation();
    }); 


   
    $(window).scroll(function() {

            if(window.innerWidth > 1283){

                const selectControls = $('#compare-option-selector .grid__inner');
                var scrollTop = $(window).scrollTop();

                if(scrollTop >= 180 ) {
                    selectControls.addClass('mdc-select--position-fixed');
                }else{
                    selectControls.removeClass('mdc-select--position-fixed');
                }
            }
        });

        function post_selection_action(){
            $("html, body").animate({scrollTop: $('#compare-option-selector').offset().top - 180}, 1000);

        }


    function eventFire(el, etype){
      if (el.fireEvent) {
        el.fireEvent('on' + etype);
      } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
      }
    }


    function jsonEditor(jsonData) {
        
        // Create the editor
        const container = document.getElementById('jsoneditor');
        const options = {
          mode: 'tree'
        };
        const editor = new JSONEditor(container, options);

        // Set JSON data
        /*const json = {
          "name": "John",
          "age": 30,
          "city": "New York"
        };*/
        const json = {
          jsonData
        };
        editor.set(json);

        // Get JSON data
        const updatedJson = editor.get();
        console.log(updatedJson);
        
    }



    $(document).ready( function(){
    /*Simulate preselected options , since the current script doesnt seem to allow for firing the function with preselected values */
        eventFire(document.querySelector('.mdc-select__menu[data-for="mdc-select-compare-1"] ul li[data-value="evolve-option"]'), 'click');

        eventFire(document.querySelector('.mdc-select__menu[data-for="mdc-select-compare-2"] ul li[data-value="incentive-option"]'), 'click');

        /* CDM-1600 - health revamp - UI changes - remove 3rd column and selector */
        /*eventFire(document.querySelector('.mdc-select__menu[data-for="mdc-select-compare-3"] ul li[data-value="extender-option"]'), 'click');*/

        setTimeout(compare_options, 1000);

        //expanderInit();
        /*eventFire(document.querySelector('#btn-compare .mdc-button'), 'click');*/

    });


 