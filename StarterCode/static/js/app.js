const url = "../samples.json";


const samples = d3.json(url);

// var example = ["a", "b", "c"];

d3.json(url).then(function(samples) {
    console.log(samples.names);

    d3.select('#selDataset')
        .selectAll('myOptions')
        .data(samples.names)
        .enter()
        .append('option')
        .text(d => d)
        .attr("value", d => d)

    var dropdown = d3.select('#selDataset');
    dropdown.on("change", function() {
        var selectedID = d3.event.target.value;
        console.log(selectedID);

        var jsonSample = samples.samples;
        var matchingSample = jsonSample.find(d => d.id == selectedID);
        var matchingSampleValues = matchingSample.sample_values;

        var sampleObject = matchingSampleValues.map(function(item, index){
            return {
                sample_values: item,
                otu_ids: matchingSample.otu_ids[index],
                otu_labels: matchingSample.otu_labels[index]
            }            
        });

       function getTopTen(inputArray) {
            var topTen = inputArray.sort((a,b) => b.sample_values-a.sample_values).slice(0,10);
            return topTen;
        };


        var values = [];
        var labels = [];
        var hoverText = [];

        var topTenIds = getTopTen(sampleObject);

        function createNewArray(object) {
            for (var i=0; i < object.length; i++) {
                values.push(object[i].sample_values);
                labels.push(`OTU: ${object[i].otu_ids}`);
                hoverText.push(object[i].otu_labels);
            }
        }
        
        createNewArray(topTenIds);
        
        console.log(values);
        console.log(labels);
        console.log(hoverText);

        var trace = {
            x: values,
            y: labels,
            text: hoverText,
            type: "bar",
            orientation: 'h'
        };
        
        var data = [trace];
        var layout = {
            title: "Bar Chart",
            xaxis: {title: "X-axis"},
            yaxis: {title: "Bars"}
        };

        Plotly.newPlot('bar', data, layout);
    });
});
    
// var data = [
//     {
//       x: samples.otu_ids,
//       y: samples.samples_values,
//       type: 'bar'
//     }
//   ];
  
//   Plotly.newPlot('myDiv', data);