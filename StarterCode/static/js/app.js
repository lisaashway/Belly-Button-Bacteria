const url = "../samples.json";


const samples = d3.json(url);

d3.json(url).then(function(samples) {
    console.log(samples.names);

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

        //Creating Panel Body
        var panelBody = d3.select(".panel-body");
        var panelTable = panelBody.append("table");
        var tbody = panelTable.append("tbody");
        var entries = d3.entries(matchingDemo);

        entries.forEach(entry => {
            var row = tbody.append("tr");
            var listElement = row.append("td");
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
            orientation: 'h'
        };

        var data = [trace1];
        var layout = {
            title: "Bar Chart",
            xaxis: {title: "X-axis"},
            yaxis: {title: "Bars"}
        };

        Plotly.newPlot('bar', data, layout);

        //Creating Bubble Chart
        var trace2 = {
            x: topTenIds.map(id => id.otu_ids),
            y: topTenIds.map(id => id.sample_values),
            mode: 'markers',
            marker: {
                size: topTenIds.map(id => id.sample_values)},
            text: topTenIds.map(id => id.otu_labels) ,
            type: "bubble"
        };

        var data = [trace2];
        var layout = {
            title: 'Marker Size',
            showlegend: false,
            height: 600
          };
          
          Plotly.newPlot('bubble', data, layout);


        //Creating Gauge Chart
        console.log(matchingDemo.wfreq);
        var data = [{
            value: matchingDemo.wfreq,
            domain: { x: [0, 1], y: [0, 1] },
            title: { text: "Wash Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] }
            }   
        }];
        
        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);
        
        //When Dropdown Changes
        var dropdown = d3.select('#selDataset');
        dropdown.on("change", function() {
            var selectedID = d3.event.target.value;
            console.log(selectedID);

            //Getting Test Subject Demographics
            var jsonDemo = samples.metadata;
            var matchingDemo = jsonDemo.find(d => d.id == selectedID);

            //Updating Panel Body
            var panelBody = d3.select(".panel-body");
            //Deleting Existing 
            panelBody.selectAll("table").remove();
            //Adding New List
            var panelTable = panelBody.append("table");
            var tbody = panelTable.append("tbody");
            var entries = d3.entries(matchingDemo);
    
            entries.forEach(entry => {
                var row = tbody.append("tr");
                var listElement = row.append("td");
                listElement.text(`${entry.key}:  ${entry.value}`);
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
                text: [topTenIds.map(id => id.otu_labels)]
            };

            Plotly.restyle('bar', update, [0,1,2]);

            //Updating Bubble Chart
            var update = {
                x: [topTenIds.map(id => id.otu_ids)],
                y: [topTenIds.map(id => id.sample_values)],
                marker: [{
                    size: topTenIds.map(id => id.sample_values)}],
                text: [topTenIds.map(id => id.otu_labels)]
            };
            
            Plotly.restyle('bubble', update, [0,1,3,4]);

            console.log(matchingDemo.wfreq);

            var update = {
                value: matchingDemo.wfreq,
                domain: { x: [0, 1], y: [0, 1] },
                title: { text: "Wash Frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9] }
                }   
            };

            Plotly.restyle('gauge', update);
        });
});































    