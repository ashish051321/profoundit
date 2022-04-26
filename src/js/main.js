document.addEventListener('DOMContentLoaded', function () {
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
    modal.find('#modal-title').text(jobObject.jobTitle);
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

    modal.find('#modalApplyButton').attr('href', "mailto:careers@profounditllc.com?subject=Application for " + jobObject.jobTitle);
  });

});