<script>
  import { getLocalStorageValue } from './utils';

  let currentUrl = document.URL
  const baseUrl = 'https://mentors.neverdieone.ru'
  let opStatus = -1
  let opMessage = ''
  let opInfo = ''

  window.setInterval(() => {
    currentUrl = document.URL
  }, 3000)

  function clearOp() {
    window.setTimeout(() => {
      opStatus = -1
      opMessage = ''
    }, 3000)
  }

  async function getStudyDays() {
    let currentOrder = document.URL.split('orders/')[1]

    let response = await fetch(`${baseUrl}/get_study_days/?order_uuid=${currentOrder}`, {
      method: 'GET',
    })
    let studyDays = await response.json()
    return studyDays['message']
  }

  async function sendPlan() {
    let currentOrder = document.URL.split('orders/')[1]
    
    let session = await getLocalStorageValue('tgSession')
    let template = await getLocalStorageValue('template')
    console.log(template)

    let response = await fetch(`${baseUrl}/send_plan/?order_uuid=${currentOrder}`, {
      headers: {session: session},
      method: 'POST',
      body: template
    })
    let result = await response.json()

    opStatus = response.status
    opMessage = result['message']

    clearOp()
  }

  async function sendInternship() {
    let currentOrder = document.URL.split('orders/')[1]

    let session = await getLocalStorageValue('tgSession')
    let response = await fetch(`${baseUrl}/internship/?order_uuid=${currentOrder}`, {
      headers: {session: session},
      method: 'POST'
    })
    let result = await response.json()

    opStatus = response.status
    opMessage = result['message']

    clearOp()
  }

  async function sendAcademicLeave() {
    let currentOrder = document.URL.split('orders/')[1]

    let session = await getLocalStorageValue('tgSession')
    let response = await fetch(`${baseUrl}/academic_leave/?order_uuid=${currentOrder}`, {
      headers: {session: session},
      method: 'POST'
    })
    let result = await response.json()
    
    opStatus = response.status
    opMessage = result['message']

    clearOp()
  }

  async function sendPlans() {
    let session = await getLocalStorageValue('tgSession')
    let mentorUuid = await getLocalStorageValue('mentorUuid')
    let template = await getLocalStorageValue('template')

    let response = await fetch(`${baseUrl}/send_plans/?mentor_uuid=${mentorUuid}`, {
      headers: {session: session},
      method: 'POST',
      body: template
    })
    let result = await response.json()
    let messages = result['messages']

    for (let num in messages) {
      let message = messages[num]

      let statusEmoji
      if (message.status == 'ok') {
        statusEmoji = '✅'
      } else if (message.status == 'warning') {
        statusEmoji = '🟡'
      } else if (message.status == 'error') {
        statusEmoji = '❌'
      }

      let element = document.querySelector(`a[href*="${message.order_id}"]`)
      let closestDiv = element.closest('div')
      
      let newElem = document.createElement('div')
      newElem.innerText = `${statusEmoji}: ${message.message}`
      closestDiv.appendChild(newElem)
    }
  }

</script>

<main>
  <div id="mentorsExtension" class="container">
    <div class="row text-center">
        <h4>Mentors Extension</h4>
    </div>
    <hr>

    <div class="row text-center">
      <div class="list-group">
        {#if currentUrl === "https://mentors.dvmn.org/mentor-ui/"}
          <button type="button" class="list-group-item list-group-item-action" on:click={sendPlans}>Разослать всем планы</button>
        {:else if currentUrl.includes('/orders/')}
          <button type="button" class="list-group-item list-group-item-action" on:click={sendPlan}>Отправить план</button>
          <button type="button" class="list-group-item list-group-item-action" on:click={sendAcademicLeave}>Отправить в академ</button>
          <button type="button" class="list-group-item list-group-item-action" on:click={sendInternship}>Отправить на стажировку</button>
          <button type="button" class="list-group-item list-group-item-action" disabled>
            {#await getStudyDays()}
              Вычисляю
            {:then value}
              Учился {value} дней за последнюю неделю
            {/await}
          </button>
        {/if}
      </div>
    </div>
    <hr>

    {#if opStatus != -1}
      <div class="row text-center">
        
        {#if opStatus != 200}
          <div class="alert alert-danger" role="alert">
            {opMessage}
          </div>
        {:else}
          <div class="alert alert-success" role="alert">
            {opMessage}
          </div>
        {/if}
      </div>
    {/if}

    {#if opInfo != ''}
      <div class="alert alert-warning" role="alert">
        {opInfo}
      </div>
    {/if}

  </div>
</main>

<style>
  #mentorsExtension {
    position: fixed;
    top: 10px;
    left: 10px;
    max-width: 300px;
  }
</style>
