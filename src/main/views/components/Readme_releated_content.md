# Related Content macro

## How to use
Step #1
Include the macro in the respective .njk file
```
{% from "components/releatedContent.njk" import CCSReleatedContent %}
<div class="govuk-grid-column-one-third">
    {{ CCSReleatedContent(releatedContent) }}
</div>
```

Step #2
In the controller file you have to feed in `releatedContent` data

`const releatedContent = req.session.releatedContent` 

Send the data to .njk via res.render

`res.render('questionsPage', releatedContent);`
