function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Diverging stacked bars</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Diverging stacked bars

The dataset contains hundreds of answers to a survey. There are five questions, and the answers rank from negative/red (“Strongly Disagree”, “Disagree”), then neutral/gray, to positive/blue (“Agree”, “Strongly Agree”). Answers are counted and represented as bars describing the absolute frequency of each response. The [bars](https://observablehq.com/plot/marks/bar) are organized in the order of their semantic value, with the
negative answers flowing to the left, and the positive answers flowing to the right. Neutral answers sit in the center. We use a custom [stack offset](https://observablehq.com/plot/transforms/stack#stack-options) to position the bars correctly.`
)}

function _2(Plot,likert,survey){return(
Plot.plot({
  x: {tickFormat: Math.abs},
  color: {domain: likert.order, scheme: "RdBu", legend: true},
  marks: [
    Plot.barX(
      survey,
      Plot.groupZ({x: "count"}, {fy: "Question", fill: "Response", ...likert})
    ),
    Plot.axisX(
      {label: "← Number of Responses →                                                             ", labelAnchor: "center", tickFormat: Math.abs}
    ),
    Plot.axisFy(
      {label: null, anchor: "left"}
    ),
    Plot.ruleX([0])
  ]
}).outerHTML
)}

function _3(Plot,likert){return(
Plot.legend({color: {domain: likert.order, scheme: "RdBu"}}).outerHTML
)}

function _likert(Likert){return(
Likert([
  ["Strongly Disagree", -1],
  ["Disagree", -1],
  ["Kinda Disagree", -1],
  ["Neutral", 0],
  ["Kinda Agree", 1],
  ["Agree", 1],
  ["Strongly Agree", 1]
])
)}

function _5(md){return(
md`For a reference, see Naomi B. Robbins and Richard M. Heiberger, “Plotting Likert
and Other Rating Scales”, 2011
([PDF](http://www.asasrms.org/Proceedings/y2011/Files/300784_64164.pdf)).

_Thanks to [Eitan Lees](/@eitanlees) for asking the
[question](https://talk.observablehq.com/t/diverging-stacked-bar-chart-in-plot/6028)
that prompted this notebook. The write-up below details how we built the chart
(click on the cell definitions to see the code at each stage)._

---`
)}

function _6(md){return(
md`### First try: stacking bars`
)}

function _7(md){return(
md`Using Plot.groupY and fill: "Response" allows us to create a bar for each type of response to each question. The length of each bar corresponds to the count of the corresponding answers (as the *fill* or *z* channel) to the question (as the *y* channel).`
)}

function _8(Plot,survey){return(
Plot.plot({
  x: { tickFormat: Math.abs, label: "# of answers" },
  y: { tickSize: 0 },
  color: {
    legend: true,
    domain: [
      "Strongly Disagree",
      "Disagree",
      "Kinda Disagree",
      "Neutral",
      "Kinda Agree",
      "Agree",
      "Strongly Agree"
    ],
    scheme: "RdBu"
  },
  marks: [
    Plot.barX(
      survey,
      Plot.groupY(
        { x: "count" },
        {
          fill: "Response",
          order: [
            "Strongly Disagree",
            "Disagree",
            "Kinda Disagree",
            "Neutral",
            "Kinda Agree",
            "Agree",
            "Strongly Agree"
          ],
          y: "Question"
        }
      )
    )
  ]
})
)}

function _9(md){return(
md`The next step is to make the red answers flow to the left, the blue answers to the right, and the gray centered.`
)}

function _10(md){return(
md`### Second try: negative vs positive
We introduce a function that returns the sign of a response: -1 for negatives, 0 for neutral, and 1 for positives. This allows us to send the red bars to the left, and the blue ones to the right:`
)}

function _sign(){return(
(label) => label.match(/neutral/i) ? 0 : label.match(/disagree/i) ? -1 : 1
)}

function _12(Plot,survey,sign){return(
Plot.plot({
  color: {
    domain: [
      "Strongly Disagree",
      "Disagree",
      "Kinda Disagree",
      "Neutral",
      "Kinda Agree",
      "Agree",
      "Strongly Agree"
    ],
    scheme: "RdBu"
  },
  marks: [
    Plot.barX(
      survey,
      Plot.groupY(
        { x: (d) => d.length * sign(d[0].Response) },
        {
          fill: "Response",
          order: [
            "Strongly Disagree",
            "Disagree",
            "Kinda Disagree",
            "Neutral",
            "Kinda Agree",
            "Agree",
            "Strongly Agree"
          ],
          y: "Question"
        }
      )
    )
  ]
})
)}

function _13(md){return(
md`However, this immediately raises two issues: first, the neutral value has
disappeared, because we multiplied it by zero. Second, the negative bars grow to
the left from the first element of the scale (“Strongly disagree”), resulting in
a bad ordering.`
)}

function _14(md){return(
md`### Solution: a custom offset

Since the standard strategy followed by Plot.stack ignores neutral values, we can define an offset function (a new feature introduced in Plot 0.4.3). The Likert function below takes as input the association between responses and their rating (positive, negative or neutral), and returns both an *order* and a custom *offset* to use in a stack transform.`
)}

function _normalize(Inputs){return(
Inputs.toggle({ label: "normalize" })
)}

function _16(Likert,Plot,normalize,survey)
{
  const { order, offset } = Likert([
    ["Strongly Disagree", -1],
    ["Disagree", -1],
    ["Kinda Disagree", -1],
    ["Neutral", 0],
    ["Kinda Agree", 1],
    ["Agree", 1],
    ["Strongly Agree", 1]
  ]);

  return Plot.plot({
    x: normalize
      ? { tickFormat: "%", label: "answers (%)" }
      : { tickFormat: Math.abs, label: "# of answers" },
    y: { tickSize: 0 },
    facet: { data: survey, y: "Question" },
    color: { domain: order, scheme: "RdBu" },
    marks: [
      Plot.barX(
        survey,
        Plot.groupZ(
          { x: normalize ? "proportion-facet" : "count" },
          {
            fill: "Response",
            stroke: "#777",
            strokeWidth: 0.5,
            order,
            offset
          }
        )
      ),
      Plot.textX(
        survey,
        Plot.stackX(
          Plot.groupZ(
            { x: normalize ? "proportion-facet" : "count", text: "first" },
            {
              text: (d) => d.Response.replace(/[^A-Z]/g, ""),
              z: "Response",
              order,
              offset
            }
          )
        )
      )
    ]
  });
}


function _17(md){return(
md`Note that, by splitting the dataset by question, we can use the proportion-facet reducer to normalize each question to a total of 100%. An alternative approach would be to normalize inside the offset function.`
)}

function _Likert(d3){return(
function Likert(responses) {
  const map = new Map(responses);
  return {
    order: Array.from(map.keys()),
    offset(I, X1, X2, Z) {
      for (const stacks of I) {
        for (const stack of stacks) {
          const k = d3.sum(stack, (i) => (X2[i] - X1[i]) * (1 - map.get(Z[i]))) / 2;
          for (const i of stack) {
            X1[i] -= k;
            X2[i] -= k;
          }
        }
      }
    }
  };
}
)}

function _19(md){return(
md`---
*data*`
)}

function _survey(FileAttachment){return(
FileAttachment("likval@6.json").json()
)}

function _21(Inputs,survey){return(
Inputs.table(survey, { columns: ["ID", "Question", "Response"], width: 370 })
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["likval@6.json", {url: new URL("./files/c398fadebe18b3812e450e98321dccd2725df7c3ba4ebd2bffa8c5cd4a29d674133ed43a66f8e7cc26355669194ac2d33dfc8e2a99ebab98282f98fe21b25061.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["Plot","likert","survey"], _2);
  main.variable(observer()).define(["Plot","likert"], _3);
  main.variable(observer("likert")).define("likert", ["Likert"], _likert);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["Plot","survey"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("sign")).define("sign", _sign);
  main.variable(observer()).define(["Plot","survey","sign"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("viewof normalize")).define("viewof normalize", ["Inputs"], _normalize);
  main.variable(observer("normalize")).define("normalize", ["Generators", "viewof normalize"], (G, _) => G.input(_));
  main.variable(observer()).define(["Likert","Plot","normalize","survey"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("Likert")).define("Likert", ["d3"], _Likert);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("survey")).define("survey", ["FileAttachment"], _survey);
  main.variable(observer()).define(["Inputs","survey"], _21);
  return main;
}
