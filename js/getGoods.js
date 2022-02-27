const getGoods = function () {
  const links = document.querySelectorAll('.navigation-link');
  const more = document.querySelector('.more');

  const renderGoods = (goods) => {
    const goodsContainer = document.querySelector('.long-goods-list');

    // очистили весь контеинер
    goodsContainer.innerHTML = "";

    // формируем карточку для каждого элемента товара
    goods.forEach(good => {
      const goodBlock = document.createElement('div');

      goodBlock.classList.add('col-lg-3');
      goodBlock.classList.add('col-sm-6');

      goodBlock.innerHTML = `
          <div class="goods-card">
						<span class="label ${good.label ? null : 'd-none'}">${good.label}</span>
						<img src="db/${good.img}" alt="${good.name}" class="goods-image">
						<h3 class="goods-title">${good.name}</h3>
						<p class="goods-description">${good.description}</p>
						<button class="button goods-card-btn add-to-cart" data-id="${good.id}">
							<span class="button-price">$${good.price}</span>
						</button>
					</div>
      `

      // append добавит дочерний элемент в конец
      goodsContainer.append(goodBlock);
    })
  }

  // fetch получает днные с сервера (в нашем случае локальный файл)
  // 1й then получает объект response, json() переводит в json
  // 2й then получает data (ответ в формате json)
  // создаем массив array с элементами, значение фильтруемой категории которых равно значению ссылки
  // (ссылка all не имеет дата-атрибутов, то есть category == undefined (!=true). в array поместим все элементы)
  // поместим массив в localStorage

  const getData = (value, category) => {
    fetch('db/db.json')
    .then((response) => response.json())
    .then((data) => {
      const array = category ? data.filter((item) => item[category] === value) : data;

      localStorage.setItem('goods', JSON.stringify(array));

      // перенаправление с главной на goods.html
      if (window.location.pathname !== "/goods.html") {
        window.location.href = '/goods.html';
      } else {
        renderGoods(array);
      }
    })
  }

  // вешаем событие на все пункты меню, 
  // которое при клике получает текстовое значение ссылки ('Womens', 'Mens', 'Clothing'), 
  // а также дата-атрибут категории ('gender', 'category').
  // вызывает getData со значением ссылки и категории, по которой будет идти фильтрация

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      // отключение стандартного поведения ссылки (перехода по url)
      event.preventDefault();
      const linkValue = link.textContent;
      const category = link.dataset.field;

      getData(linkValue, category);
    })
  })

  // если в localStorage что-то лежит и мы на странице товаров, вызываем renderGoods с массивом из localStorage
  if (localStorage.getItem('goods') && window.location.pathname === "/goods.html") {
    renderGoods(JSON.parse(localStorage.getItem('goods')));
  }

  // немного о localStorage:
  // setItem принимает две строки ключ: значение
  // JSON.stringify переведет объект/массив в строку 
  //* localStorage.setItem('goods', JSON.stringify({name: 'all'}));
  
  // localStorage.getItem вернет строку по ключу
  // JSON.parse переведет строку в объект/массив
  //* const goods = JSON.parse(localStorage.getItem('goods'));
  //* console.log(goods);

  // localStorage.removeItem удалит строку из localStorage по ключу
  //* localStorage.removeItem('goods');

  // вешаем слушатель событий на кнопку view all
  if (more) {
    more.addEventListener('click', (event) => {
      event.preventDefault();

      getData();
    });
  }

}

getGoods();