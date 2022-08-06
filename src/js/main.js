document.addEventListener('DOMContentLoaded', function () {

  const maxFileSizeinMB = 5;
  // const win = window
  const doc = document.documentElement

  doc.classList.remove('no-js')
  doc.classList.add('js')

  // Reveal animations
  if (document.body.classList.contains('has-animations')) {
    /* global ScrollReveal */
    const sr = window.sr = ScrollReveal()

    sr.reveal('.feature, .pricing-table-inner', {
      duration: 600,
      distance: '20px',
      easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
      origin: 'bottom',
      interval: 100
    })

    doc.classList.add('anime-ready')
    /* global anime */
    anime.timeline({
      targets: '.hero-figure-box-05'
    }).add({
      duration: 400,
      easing: 'easeInOutExpo',
      scaleX: [0.05, 0.05],
      scaleY: [0, 1],
      perspective: '500px',
      delay: anime.random(0, 400)
    }).add({
      duration: 400,
      easing: 'easeInOutExpo',
      scaleX: 1
    }).add({
      duration: 800,
      rotateY: '-15deg',
      rotateX: '8deg',
      rotateZ: '-1deg'
    })

    anime.timeline({
      targets: '.hero-figure-box-06, .hero-figure-box-07'
    }).add({
      duration: 400,
      easing: 'easeInOutExpo',
      scaleX: [0.05, 0.05],
      scaleY: [0, 1],
      perspective: '500px',
      delay: anime.random(0, 400)
    }).add({
      duration: 400,
      easing: 'easeInOutExpo',
      scaleX: 1
    }).add({
      duration: 800,
      rotateZ: '20deg'
    })

    anime({
      targets: '.hero-figure-box-01, .hero-figure-box-02, .hero-figure-box-03, .hero-figure-box-04, .hero-figure-box-08, .hero-figure-box-09, .hero-figure-box-10',
      duration: anime.random(600, 800),
      delay: anime.random(600, 800),
      rotate: [anime.random(-360, 360), function (el) { return el.getAttribute('data-rotation') }],
      scale: [0.7, 1],
      opacity: [0, 1],
      easing: 'easeInOutExpo'
    })
  }

  //global variable
  let openPositions = null;

  fetch('https://raw.githubusercontent.com/ashish051321/profoundit/master/openPositions.json')
    .then(response => response.json())
    .then(data => {
      openPositions = data;
      console.log('Fetched open positions from github repo', openPositions);
      $("#vacancies").empty();
      openPositions.forEach(jobObject => {
        $("#vacancies").append('<a class="button" style="margin: 10px !important;"  data-toggle="modal" data-target="#jobModal" data-jobid="' + jobObject.jobTitle +
          '">' + jobObject.jobTitle +
          '</a>');
      });
    });

  window.scrollSmoothlyTo = function scrollSmoothlyTo(target) {
    var target = document.getElementById(target);
    target.scrollIntoView({
      behavior: 'smooth'
    });
  }

  // $("#jobModal").on("hidden.bs.modal", function () {
  //   modal.find('#jobDescription').empty();
  //   modal.find('#jobResponsibilitiesList').empty();
  //   modal.find('#jobDescription').empty();
  // });

  $('#jobModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var jobId = button.data('jobid') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    var jobObject = openPositions.filter(item => item.jobTitle == jobId)[0];
    modal.find('#job-modal-title').text(jobObject.jobTitle);
    modal.find('#jobId').text(jobObject.jobId);
    var jobDescRef = modal.find('#jobDescription');
    jobDescRef.empty();
    jobDescRef.append("<div class='font-weight-bolder letter-spacing-1'>Job Description</div>");
    jobDescRef.append("<p>" + jobObject.jobDescription + "</p>");

    if (jobObject.jobResponsibilities) {
      var jobRespRef = modal.find('#jobResponsibilities');
      jobRespRef.empty();
      jobRespRef.append("<div class='font-weight-bolder letter-spacing-1'>Job Responsibilities</div>");
      jobRespRef.append("<ul id='jobResponsibilitiesList'> </ul>");
      var listRef = modal.find('#jobResponsibilitiesList');
      jobObject.jobResponsibilities.forEach(item => { listRef.append("<li>" + item + "</li>"); });
    } else {
      modal.find('#jobResponsibilities').empty();
    }

    if (jobObject.jobRequirements) {
      var jobReqRef = modal.find('#jobRequirements');
      jobReqRef.empty();
      jobReqRef.append("<div class='font-weight-bolder letter-spacing-1'>Candidate Qualifications</div>");
      jobReqRef.append("<ul id='jobRequirementsList'> </ul>");
      var reqListRef = modal.find('#jobRequirementsList');
      jobObject.jobRequirements.forEach(item => { reqListRef.append("<li>" + item + "</li>"); });
    } else {
      modal.find('#jobRequirements').empty();
    }

    // modal.find('#modalApplyButton').attr('href', "mailto:careers@profounditllc.com?subject=Application for " + jobObject.jobTitle);
  });


  var globalJobTitle = '';
  var globalJobId = '';
  $("#modalApplyButton").on("click", function () {
    globalJobTitle = $('#job-modal-title').html();
    globalJobId = $('#jobId').html();
    //Checking if backend is running or not. If not, we will trigger system mail.
    $("#jobModal").modal('toggle');
    showSpinner();
    fetch("https://backend.profounditllc.com/actuator/health", {
      method: "GET"
    })
      .then(json => {
        console.log('backend is working fine');
        hideSpinner();
        setTimeout(function () {
          $("#jobApplyModal").modal('toggle');
          $('#job-apply-modal-title').html(globalJobTitle);
          $('#job-apply-jobId').html(globalJobId);
        }, 900);
      }).catch(err => {
        console.log('backend is not reachable or not working fine');
        if (!window.navigator.onLine) {
          showToast('#failureToast', 'No internet connection !');
        }
        hideSpinner();
        showToast('#failureToast', 'Backend Server is down. Falling back to Native Mail Client.');
        setTimeout(function () {
          const mailSubject = 'Apply for ' + globalJobId + ': ' + globalJobTitle;
          window.open('mailto:recruiter@profounditllc.com?subject=' + mailSubject + '&body=<Please provide your basic details and attach CV>');
        }, 3000);
      });
    // setTimeout(function () {
    //   const mailSubject = 'Apply for ' + globalJobId + ': ' + globalJobTitle;
    //   window.open('mailto:recruiter@profounditllc.com?subject=' + mailSubject + '&body=<Please provide your basic details and attach CV>');
    // }, 1000);


  });

  $("#modalJobSubmitButton").on("click", function (e) {
    if (!document.querySelector("#jobApplyForm").checkValidity()) {
      console.log("Form is invalid");
      return;
    } else {
      //Form is valid but check if fileSize is more than limit
      if (!isFileSizeWithinLimits(document.getElementById("jobApplyForm").elements['fileAttachment'].files[0])) {
        //clear the file
        $("#fileAttachment").val('');
        document.querySelector("#chosen-file-name").textContent = "File size should be <= " + maxFileSizeinMB + " MB";
        return;
      }
      console.log("Form is valid and we will proceed to submit the application!")
    }
    const formObject = {
      jobId: globalJobId.trim(),
      jobTitle: globalJobTitle.trim(),
      dateTime: new Date().toGMTString()
    };
    const errorMessage = "Please complete all the fields in this form including resume upload."

    const fieldIds = ['firstName', 'lastName', 'fileAttachment', 'tAndC']
    fieldIds.forEach(function (fieldId) {
      document.getElementById("jobApplyForm").elements[fieldId].value
      formObject[fieldId] = document.getElementById("jobApplyForm").elements[fieldId].value;

      if (fieldId == 'fileAttachment') {
        formObject[fieldId] = 'File Attached in mail';
      }
      if (fieldId == 'tAndC') {
        formObject[fieldId] = document.getElementById("jobApplyForm").elements[fieldId].checked;
      }

    })

    console.log(formObject);
    triggerEmailForJobApply({
      "to": "careers@profounditllc.com,recruiter@profounditllc.com",
      "subject": formObject['firstName'] + " " + formObject['lastName'] + ": Application for " + globalJobTitle + "( " + globalJobId + " )",
      "messageText": JSON.stringify({ formObject })
    }, document.getElementById("jobApplyForm").elements['fileAttachment'].files[0]);

    $("#jobApplyModal").modal('toggle');

  });

  function isFileSizeWithinLimits(inputFile) {
    const filesize = inputFile.size / 1024 / 1024;
    console.log('This file size is: ' + filesize + "MB")
    return (filesize <= maxFileSizeinMB);
  }

  function triggerEmailForJobApply(jsonInput, file) {
    showSpinner();
    var requestData = new FormData();
    requestData.append('mailRequest', JSON.stringify(jsonInput));
    requestData.append('file', file);
    // POST request using fetch()
    fetch("https://backend.profounditllc.com/sendMailWithAttachments", {

      // Adding method type
      method: "POST",

      // Adding body or contents to send
      body: requestData,

      // Adding headers to the request
      // headers: {
      //   "Content-type": "multipart/form-data; charset=UTF-8"
      // }
    })

      .then(json => {
        console.log(json);
        hideSpinner();
        showToast('#successToast', 'Application submitted !');
      }).catch(err => {
        if (!window.navigator.onLine) {
          showToast('#failureToast', 'No internet connection !');
        }
        hideSpinner();
        showToast('#failureToast');
      });
  }

  function showToast(type, message) {
    if (message) {
      $(type).html(message);
    }
    $(type).css('visibility', 'visible');
    $(type).fadeIn(200).delay(3000).fadeOut(400);
  }

  function showSpinner() {
    $('#spinner').css('visibility', 'visible');
  }

  function hideSpinner() {
    $('#spinner').css('visibility', 'hidden');
  }

  //Displaying fileName for the resume the user selects for Job application.
  var input = document.querySelector("#fileAttachment").addEventListener('change', function showFileName(event) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    document.querySelector("#chosen-file-name").textContent = fileName;
  });


});//closing DOMContentLoaded