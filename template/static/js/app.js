
//Create Pathway to json
const url = "../samples.json";

//Reading json using d3
const samples = d3.json(url);

//Function that runs after retreiving json
d3.json(url).then(function(samples) {
    console.log(samples.names);

    //Create drop down menu from sample.names
    d3.select('#selDataset')
        .selectAll('myOptions')
        .data(samples.names)
        .enter()
        .append('option')
        .text(d => d)
        .attr("value", d => d)

        //Initializing dashboard with default Test Sample ID
        var selectedID = "940";
        console.log(selectedID);

        //Getting Test Subject Demographics
        var jsonDemo = samples.metadata;
        var matchingDemo = jsonDemo.find(d => d.id == selectedID);

        //Creating Side Panel of Dempgraphic Info Body
        var selectDiv = d3.select("#sample-metadata");
        var table = selectDiv.append("table");
        var tbody = table.append("tbody");
        var entries = d3.entries(matchingDemo);

        //Adding each demographic info in a table with a single column
        entries.forEach(entry => {
            var row = tbody.append("tr");
            var listElement = row.append("td");
            listElement.attr("class", "text-muted");
            listElement.style("font-size", "12x"); // change font-size to 24px 
            listElement.text(`${entry.key}: ${entry.value}`);
        });

        //Getting Test Subject Sample Values
        var jsonSample = samples.samples;
        var matchingSample = jsonSample.find(d => d.id == selectedID);
        var matchingSampleValues = matchingSample.sample_values;

        //Mapping each Bacteria as an Object for the selected Test Subject
        var sampleAsObjects = matchingSampleValues.map(function(item, index){
            return {
                sample_values: item,
                otu_ids: matchingSample.otu_ids[index],
                otu_labels: matchingSample.otu_labels[index]
            }            
        });
        //Getting Ten Objects with the largest sample values
       function getTopTen(inputArray) {
            var topTen = inputArray.sort((a,b) => b.sample_values-a.sample_values).slice(0,10);
            return topTen;
        };
        var topTenIds = getTopTen(sampleAsObjects);
        
        //Creating Bar Chart
        var trace1 = {
            x: topTenIds.map(id => id.sample_values),
            y: topTenIds.map(id => `OTU: ${id.otu_ids}`),
            text: topTenIds.map(id => id.otu_labels),
            type: "bar",
            orientation: 'h',
            marker: {
                size: topTenIds.map(id => id.sample_values),
                color: topTenIds.map(id => id.sample_values),
                colorscale: 'Picnic'
            },
        };

        var data = [trace1];
        var layout = {
            xaxis: {title: "Top Ten Bacterial Species Found"},
        };

        Plotly.newPlot('bar', data, layout);

        //Creating Bubble Chart
        var trace2 = {
            x: sampleAsObjects.map(id => id.otu_ids),
            y: sampleAsObjects.map(id => id.sample_values),
            mode: 'markers',
            marker: {
                size: sampleAsObjects.map(id => id.sample_values),
                color: sampleAsObjects.map(id => id.sample_values),
                colorscale: 'Picnic'
            },
            text: sampleAsObjects.map(id => id.otu_labels) ,
            type: "bubble",   
            opacity: 0.7
        };

        var data = [trace2];
        var layout = {
            title: 'Belly Button Bacteria',
            showlegend: false,
            height: 600,
            xaxis: {title: "OTU  ID Number"},
            yaxis: {title: "Bacteria Found"}
          };
          
          Plotly.newPlot('bubble', data, layout);


        //Creating Gauge Chart
        var data = [{
            value: matchingDemo.wfreq,
            domain: { x: [0, 1], y: [0, 1] },
            title: { text: "Belly Button Wash Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                bar: { color: "cornflowerblue" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    { range: [0, 1.5], color: "Lavender" },
                    { range: [1.5, 3], color: "Plum" },
                    { range: [3, 4.5], color: "Orchid" },
                    { range: [4.5, 6], color: "MediumOrchid" },
                    { range: [6, 7.5], color: "DarkOrchid" },
                    { range: [7.5, 9], color: "DarkSlateBlue" }
             ]}
        }];
        
        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);
        
        //Function that runs When Dropdown Changes
        var dropdown = d3.select('#selDataset');
        dropdown.on("change", function() {
            var selectedID = d3.event.target.value;
            console.log(selectedID);

            //Getting Test Subject Demographics
            var jsonDemo = samples.metadata;
            var matchingDemo = jsonDemo.find(d => d.id == selectedID);
            console.log(matchingDemo)

            //Creating Side Panel of Dempgraphic Info Body
            var selectDiv = d3.select("#sample-metadata");
            selectDiv.selectAll("table").remove();
            var table = selectDiv.append("table");
            var tbody = table.append("tbody");
            var entries = d3.entries(matchingDemo);

            //Adding each demographic info in a table with a single column
            entries.forEach(entry => {
                var row = tbody.append("tr");
                var listElement = row.append("td");
                listElement.attr("class", "text-muted");
                listElement.style("font-size", "12x"); // change font-size to 24px 
                listElement.text(`${entry.key}: ${entry.value}`);
            });

            //Getting Test Subject Sample Values
            var jsonSample = samples.samples;
            var matchingSample = jsonSample.find(d => d.id == selectedID);
            var matchingSampleValues = matchingSample.sample_values;

            //Mapping each Bacteria as an Object for the selected Test Subject
            var sampleAsObjects = matchingSampleValues.map(function(item, index){
                return {
                    sample_values: item,
                    otu_ids: matchingSample.otu_ids[index],
                    otu_labels: matchingSample.otu_labels[index]
                }            
            });

            //Getting Ten Objects with the largest sample values
            function getTopTen(inputArray) {
                var topTen = inputArray.sort((a,b) => b.sample_values-a.sample_values).slice(0,10);
                return topTen;
            };
            var topTenIds = getTopTen(sampleAsObjects);
            
            //Updating Bar Chart
            var update = {
                x: [topTenIds.map(id => id.sample_values)],
                y: [topTenIds.map(id => `OTU: ${id.otu_ids}`)],
                text: [topTenIds.map(id => id.otu_labels)],
                marker: {
                    size: topTenIds.map(id => id.sample_values),
                    color: topTenIds.map(id => id.sample_values),
                    colorscale: 'Picnic'
                },
            };

            Plotly.restyle('bar', update, [0,1,2,5]);

            //Updating Bubble Chart
            var update = {
                x: [sampleAsObjects.map(id => id.otu_ids)],
                y: [sampleAsObjects.map(id => id.sample_values)],
                marker: [{
                    size: sampleAsObjects.map(id => id.sample_values),
                        color: sampleAsObjects.map(id => id.sample_values),
                        colorscale: 'Picnic'
                    }],
                text: [sampleAsObjects.map(id => id.otu_labels)]
            };
            
            Plotly.restyle('bubble', update, [0,1,3,4]);

            console.log(matchingDemo.wfreq);

            //Updating Gauge Chart
            var update = {
                value: [matchingDemo.wfreq],
                domain: [{ x: [0, 1], y: [0, 1] }],
                title: [{ text: "Belly Button Wash Frequency" }],
                type: ["indicator"],
                mode: ["gauge+number"],
                gauge: [{
                    axis: { range: [null, 9] },
                    bar: { color: "cornflowerblue" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 1.5], color: "Lavender" },
                        { range: [1.5, 3], color: "Plum" },
                        { range: [3, 4.5], color: "Orchid" },
                        { range: [4.5, 6], color: "MediumOrchid" },
                        { range: [6, 7.5], color: "DarkOrchid" },
                        { range: [7.5, 9], color: "DarkSlateBlue" }
                 ]}]
            };

            Plotly.restyle('gauge', update);
        });
});































    