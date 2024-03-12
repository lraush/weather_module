import conditions from "./conditions.js";


const apiKey = '41b93fd17cfa4c23939162035240803';

//https://api.weatherapi.com/v1/current.json?key=41b93fd17cfa4c23939162035240803&q=moscow&aqi=no
 // Элементы на странице
  const header = document.querySelector('.header');
  const form = document.querySelector('.form');
  const input = document.querySelector('.input__city');
  const btnClose = document.querySelector('.btn__open');
  const container = document.querySelector('.container');
  const body = document.querySelector('.body__open');

  btnClose.addEventListener('click', () => {
    btnClose.classList.toggle('btn__open');
    btnClose.classList.toggle('btn__close');
    container.classList.toggle('container__none');
    body.classList.toggle('body__open');


  })

  function removeCard() {
  	const prevCard = document.querySelector('.card');
  	if (prevCard) prevCard.remove();
  }

 function showError(errorMessage) {
 	// Отобразить карточку с ошибкой
 	const html = `<div class="card">${errorMessage}</div>`;

 	// Отображаем карточку на странице
 	header.insertAdjacentHTML('afterend', html);
 }

  function showCard({ name, country, temp, condition, imgPath }) {
  	// Разметка для карточки
  	const html = `<div class="card">
                         <div class="card__city">
                             <h2 class="city__name">${name}<span class="city__name--el">${country}</span>
                             </h2>
                          </div>
                         <div class="card__weather">
                           <div class="card__value">${temp}<sup>°C</sup></div>
                           <img src="${imgPath}" alt="" class="card__img">
                        </div>
                        <div class="card__description">
                            <p class="description__text">
                               ${condition}
                            </p>
                        </div>`;

 	// Отображаем карточку на странице
 	header.insertAdjacentHTML('afterend', html);
 }

 async function getWeather(city) {
 	const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
 	const response = await fetch(url);
 	const data = await response.json();
 	console.log(data);
     return data;
 }

 // Слушаем отправку формы
 form.onsubmit = async function (e) {
 	// Отменяем отправку формы
 	e.preventDefault();

 	// Берем значение из инпута, обрезаем пробелы
 	let city = input.value.trim();

     // Получаем данные с сервера
     const data = await getWeather(city);

     if (data.error) {
 		removeCard();
 		showError(data.error.message);
 	} else {
 		removeCard();

        console.log(data.current.condition.code);

        const info = conditions.find((obj) => obj.code === data.current.condition.code)
        console.log(info);
        console.log(info.languages[23]['day_text']);

        const filePath ='./images/' + (data.current.is_day ? 'day' : 'night') + '/';
        const fileName = (data.current.is_day ? info.icon: info.icon) + '.png';
        const imgPath = filePath + fileName;
        console.log('fileName', filePath + fileName)

         const weatherData = {
 			name: data.location.name,
 			country: data.location.country,
 			temp: data.current.temp_c,
 			condition: data.current.is_day
                        ? info.languages[23]['day_text']
                        : info.languages[23]['night_text'],
            imgPath,
 		};

 		showCard(weatherData);
 	}

 };