//question page after selection a category and submitting the form on question main page
function getCategoryQuestions() {
      var inserts = document.getElementById('questionCategory').value;
      console.log(inserts);

      // Redirect to URI with params
      window.location = '/questionMain/filter/' + encodeURI(inserts);
};
