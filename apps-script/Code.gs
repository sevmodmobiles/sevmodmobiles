// v46: статус при добавлении расходов — adminAddExpense принимает status
//      (значение из выпадающего списка колонки "Статус"; по умолчанию
//      "НЕ ОПЛАЧЕНО"), adminExpenseLookups отдаёт statuses и defaultStatus.
// v45: статусы расходов — в выпадающий список колонки "Статус" скрипт сам
//      добавляет все статусы из сводки в шапке листа ("По Акту", "По Графику",
//      "Под отчет" и т.д.), которых там нет; уже имеющиеся значения остаются.
//      Делается при каждой записи расходов, при открытии обзора в приложении и
//      пунктом меню "Включить строгие списки в расходах".
// v44: обзор расходов для приложения — adminExpenseOverview: сводка из шапки
//      листа "Расходы SEVMOD (копия)" (строки над заголовками: подпись, сумма,
//      цвет ячейки — "ОПЛАЧЕНО", "НЕ ОПЛАЧЕНО", "По Акту", "Под отчет",
//      "Кирилл", "Влад" и т.д., как их считают формулы таблицы) и все строки
//      расходов (дата, работник, бригадир, объект, ставка, итого, статус,
//      дата погашения, комментарий).
// v43: расходы по бригадам. adminAddExpense принимает entries [{worker, rate}]
//      — несколько работников с бригадиром, у каждого своя ставка; строка на
//      каждый день и каждого работника. adminExpenseLookups дополнительно
//      отдаёт brigades (состав бригады = работники последней записи с этим
//      бригадиром, со ставками) и lastRates (последняя ставка работника).
// v42: расходы — жёсткий выбор из списков. Новый лист "Справочник расходов"
//      (создаётся сам): колонка A "Работники", колонка B "Бригадиры" (если B
//      пустая — бригадиром можно выбрать любого из работников). Колонкам
//      "Работник", "Бригадир", "Объект" листа расходов ставятся строгие
//      выпадающие списки (из справочника и листа "Объекты") — вручную в
//      таблице ввести другое значение нельзя. adminAddExpense отклоняет
//      значения не из списков, adminExpenseLookups отдаёт эти списки.
//      Пункт меню "Включить строгие списки в расходах".
// v41: расходы — после каждой записи строки листа "Расходы SEVMOD (копия)"
//      сортируются по колонке "Дата" (новые записи встают по хронологии между
//      старыми), на строке заголовков всегда стоит фильтр (создаётся, если его
//      нет). Пункт меню "Отсортировать расходы по дате" — для ручных правок.
// v40: расходы — сломанная проверка данных (выпадающий список ссылается на
//      лист, которого в таблице нет, например "Справочники" из таблицы
//      финдира) больше не роняет запись с ошибкой "Диапазон не найден".
//      Колонка "Объект" перенастраивается на список листа "Объекты" (он и так
//      синхронизирован со "Справочниками" финдира); у остальных колонок
//      сломанная проверка снимается только с новых строк. Об этом
//      возвращается предупреждение.
// v39: расходы — значения проверяются по выпадающим спискам листа (проверка
//      данных) ДО записи: если, например, объекта нет в списке колонки
//      "Объект", ничего не пишется и возвращается понятная ошибка (раньше
//      строка записывалась частично). Регистр букв подгоняется под список.
//      adminExpenseLookups берёт подсказки из этих же списков.
// v38: расходы пишутся в рабочий лист "Расходы SEVMOD (копия)" (заголовки в
//      8-й строке, над ними итоги). Лист больше не создаётся сам. Дополнительно
//      заполняются колонки этого листа: "Месяц цифрой", "Кол-во человек" (1),
//      "Итого", "Статус" (НЕ ОПЛАЧЕНО). Если в колонке у предыдущей строки
//      формула — она протягивается на новые строки вместо значения.
// v37: расходы за период — adminAddExpense принимает dateTo; за каждый день
//      периода (включительно, до 62 дней) пишется отдельная строка с той же
//      ставкой. Ответ дополнительно содержит rowTo и days.
// v36: ключ Яндекс.Геокодера больше не хранится в коде — читается из свойств
//      скрипта (Настройки проекта → Свойства скрипта → YANDEX_GEOCODER_API_KEY).
// v35: расходы пишутся в лист "Расходы SEVMOD" НАШЕЙ таблицы (а не во внешнюю); если листа нет — создаётся.
// v34: админ-функция "Добавить расходы" — запись строки в другую таблицу (лист "Расходы SEVMOD"):
//      adminAddExpense, adminExpenseLookups. Колонки ищутся по заголовкам (Дата/Работник/Бригадир/Объект/Ставка/Комментарий).
// v33: getMyStats возвращает ещё и absences (отгулы со статусами) — для списка в «Мой кабинет».
// v32: adminAbsencePending — лёгкий запрос "сколько заявок на отгул ждут
//      согласования" (для красной точки и всплывающего уведомления админу).
// v31: согласование отсутствий. В листе "Отсутствия" новые колонки "Статус"
//      (На согласовании / Согласовано / Не согласовано), "Кем решено",
//      "Когда решено". Админ видит заявки и решает (adminGetAbsences,
//      adminDecideAbsence). Итоги "нарастающим итогом" теперь считаются
//      ТОЛЬКО по согласованным заявкам (старые заявки без статуса считаются
//      "На согласовании").
// v29: отгулы / больничные / "приду позже, уйду раньше". Новый лист
//      "Отсутствия" (создаётся сам), действия submitAbsence и getMyAbsences.
//      Отгулы и больничные считаются в рабочих днях (пн–пт, 8 ч/день,
//      праздники НЕ вычитаются), частичные — в часах; дни = часы / 8.
//      Итоги нарастающим итогом — по каждому сотруднику, в пределах года
//      даты начала отсутствия.
/**
 * Учёт рабочего времени — v28
 * Изменения по сравнению с v27:
 *  - двусторонняя синхронизация списка объектов с таблицей финдира (лист
 *    "Справочники", столбец B, отдельный Google-файл по ID). Новая функция
 *    syncObjectsWithFindir_: объект, добавленный у нас (из приложения или
 *    прямо в листе "Объекты"), сам дописывается в конец её столбца B;
 *    объект, добавленный финдиром у себя, сам появляется у нас в "Объекты"
 *    (только название, без адреса — его дозаполняет админ). При добавлении
 *    объекта из приложения (adminAddObject) синхронизация запускается сразу
 *    же; плюс отдельный триггер по расписанию (setupFindirSyncTrigger,
 *    каждые 10 минут) — на случай добавления объекта прямо в таблице (не
 *    через приложение) или нового объекта у финдира. Новые пункты меню:
 *    "Синхронизировать объекты с финдиром сейчас (разово)" и "Включить
 *    автосинхронизацию объектов с финдиром (раз)". ВАЖНО: нужны права
 *    редактора на её таблицу и первый запуск синхронизации вручную из
 *    редактора Apps Script (чтобы разрешить скрипту доступ к чужому файлу)
 *
 * Изменения v27 (сохранены) по сравнению с v26:
 *  - экран "Объекты" в панели администратора теперь позволяет настраивать
 *    расписание смен (Смена 1 и Смена 2, начало/конец) и ответственного
 *    прораба объекта (один на весь объект, выбирается из списка
 *    сотрудников) — и при добавлении нового объекта, и для уже
 *    существующих. Новая колонка в листе "Объекты" — "Ответственный прораб"
 *    (J), хранит телефон, как и остальные ссылки на сотрудников в проекте.
 *    Новые функции adminUpdateObjectShifts (запись) — adminGetObjects
 *    расширен и возвращает shift1Start/shift1End/shift2Start/shift2End и
 *    foremanPhone/foremanName
 *
 * Изменения v26 (сохранены) по сравнению с v25:
 *  - новые admin-действия adminGetObjects/adminAddObject: панель
 *    администратора теперь может читать список объектов и добавлять новый
 *    (название + адрес) прямо из приложения, без похода в саму таблицу.
 *    При добавлении адрес сразу геокодируется (тем же geocodeAddress_, что
 *    и при ручном вводе в листе), так что координаты для GPS-проверки
 *    появляются сразу же, а не ждут следующего открытия таблицы
 *
 * Изменения v25 (сохранены) по сравнению с v24:
 *  - предупреждение о попытке отметиться не на объекте теперь показывает
 *    расстояние в километрах с одним знаком после запятой, если оно от
 *    1000 м и больше (например "1.4 км"), а не длинным числом метров —
 *    formatDistanceMeters_
 *  - в лист "Попытки вне объекта" добавлена колонка "Ближайший адрес":
 *    координаты несанкционированной попытки теперь сразу конвертируются в
 *    ближайший адрес (обратное геокодирование — reverseGeocodeAddress_, тот
 *    же Яндекс/OSM с запасным вариантом, что и для адресов объектов), чтобы
 *    не нужно было вручную открывать координаты на карте
 *
 * Изменения v24 (сохранены) по сравнению с v23:
 *  - геокодирование стало диагностируемым: если адрес не распознан ни
 *    Яндексом, ни OSM, колонка "Статус геокодирования" теперь показывает
 *    КОНКРЕТНУЮ причину по каждому из двух сервисов (например "HTTP 403: ..."
 *    для неверного/не того типа API-ключа, или "0 результатов" для
 *    действительно нераспознанного адреса) вместо общей фразы "не удалось
 *    распознать адрес". Это нужно, чтобы понять причину проблемы прямо по
 *    таблице, не обращаясь к логам Apps Script
 *
 * Изменения v23 (сохранены) по сравнению с v22:
 *  - геокодирование адресов объектов переведено на Яндекс.Геокодер
 *    (geocodeAddressYandex_) — заметно точнее знает российские адреса, чем
 *    бесплатный OpenStreetMap. Нужен свой бесплатный API-ключ — вставить
 *    его в переменную YANDEX_GEOCODER_API_KEY (инструкция в комментарии
 *    рядом). Пока ключ пустой, автоматически используется прежний способ
 *    (OpenStreetMap/Nominatim, без ключа, но менее точный для РФ) —
 *    geocodeAddressOsm_, он же прежняя geocodeAddress_
 *
 * Изменения v22 (сохранены) по сравнению с v21:
 *  - геокодирование адресов объектов (geocodeAddress_) стало точнее:
 *    поиск ограничен Россией (countrycodes=ru), из нескольких найденных
 *    вариантов берётся самый "значимый" (importance), а колонка "Статус
 *    геокодирования" теперь показывает НАЙДЕННЫЙ адрес целиком (а не
 *    просто "OK") — чтобы сразу было видно, тот ли это город, не
 *    перепутал ли сервис его с одноимённой улицей в другом месте
 *  - ВАЖНО: при вводе адреса объекта теперь обязательно писать город
 *    целиком (например "Самара, ул. Ленина, 10"), иначе при повторении
 *    названия улицы в разных городах есть риск попасть не туда
 *
 * Изменения v21 (сохранены) по сравнению с v20:
 *  - убрана "защита владельца" в isAdminPhone_: раньше BOOTSTRAP_ADMIN_EMAIL
 *    сохранял права администратора даже без галочки "Админ". По просьбе
 *    это убрано — теперь галочка в "Сотрудники" единственный источник
 *    прав, без исключений, в том числе для владельца аккаунта. Снять с
 *    себя права стало по-настоящему возможно — вернуть их тогда можно
 *    только вручную в самой таблице
 *  - adminGetAdminList соответственно больше не добавляет
 *    BOOTSTRAP_ADMIN_EMAIL в список администраторов принудительно — список
 *    строго отражает, у кого реально стоит галочка
 *
 * Изменения v20 (сохранены) по сравнению с v19:
 *  - вход в панель администратора (и постановку задач/ставки) больше НЕ
 *    требует повторного подтверждения через Google при каждом открытии —
 *    права проверяются сразу по номеру телефона, с которым человек уже
 *    вошёл в приложение: смотрим на галочку "Админ" в "Сотрудники"
 *    (новая isAdminPhone_, заменяет собой isAdminEmail_ + adminAuth_
 *    теперь принимает номер телефона вместо googleIdToken)
 *  - все adminXxx-функции (adminCheckAccess, adminGetEmployees,
 *    adminSetRate, adminGetAdminList, adminCreateTask, adminGetTasks)
 *    принимают номер телефона вместо googleIdToken; в adminSetRate и
 *    adminCreateTask теперь два разных номера — свой (для проверки прав)
 *    и исполнителя/сотрудника (data.targetPhone на фронтенде)
 *  - Google-вход по-прежнему требуется только при РЕГИСТРАЦИИ нового
 *    сотрудника (registerUser) — это отдельная, не связанная с админкой
 *    проверка личности, её не трогали
 *
 * Изменения v19 (сохранены) по сравнению с v18:
 *  - GPS-привязка объектов: в "Объекты" добавлена колонка "Адрес" — при её
 *    заполнении координаты подтягиваются сами (геокодирование через
 *    Nominatim/OpenStreetMap, без ключей и настроек), см. новые функции
 *    geocodeAddress_, onEditGeocodeObjects, setupObjectsGeocodeTrigger,
 *    geocodeAllObjects
 *  - logEvent теперь принимает geo {lat, lng} от фронтенда и, если у
 *    объекта есть координаты, сверяет их по формуле гаверсинуса
 *    (haversineMeters_); при расстоянии больше GEO_RADIUS_METERS (150 м)
 *    отметка отклоняется, попытка пишется в новый лист
 *    "Попытки вне объекта" (logGeoBlockedAttempt_)
 *  - объекты без заполненного адреса по-прежнему работают без GPS-проверки
 *
 * Изменения v18 (сохранены) по сравнению с v17:
 *  - регистрация нового сотрудника теперь требует подтверждения через
 *    Google-аккаунт (см. App.html — экран регистрации не даёт заполнить
 *    форму, пока не нажата кнопка "Войти через Google"). Раньше можно было
 *    ввести вообще любые ФИО и телефон без всякой проверки.
 *  - новая функция verifyGoogleIdToken_(idToken) — проверяет токен через
 *    собственный сервис Google (tokeninfo), а не просто доверяет тому, что
 *    прислал браузер; подделать это с фронтенда нельзя
 *  - подтверждённый email пишется в новую колонку F листа "Сотрудники"
 *    (нужно вручную подписать заголовок "Email Google" в F1 — сам скрипт
 *    заголовки не трогает)
 *  - Client ID уже вписан в GOOGLE_CLIENT_ID здесь и в App.html
 *    (540820593622-782iqaj43ksklngqmlgr2r0vigrae7m0.apps.googleusercontent.com)
 *  - новая функция keepWarm() + пункт меню "Включить автопрогрев скрипта" —
 *    борется с "холодным стартом" Apps Script (задержки до 20-30 секунд
 *    на первый после паузы запрос), периодически "пингуя" сам себя
 *  - регистрация теперь также проверяет, что этот Google-email ещё не
 *    привязан к ДРУГОМУ номеру телефона в "Сотрудники" — один Google-
 *    аккаунт больше нельзя использовать для регистрации нескольких
 *    разных номеров
 *  - вход по телефону (loginUser, для уже зарегистрированных) Google не
 *    требует — это только про регистрацию новых людей
 *
 * Изменения v17 (сохранены) по сравнению с v16:
 *  - новое действие "login": вход по номеру телефона для уже
 *    зарегистрированных сотрудников (без фото и согласия — просто
 *    проверяет номер в "Сотрудники"). Раньше при потере входа
 *    (например, "сменить пользователя" или новый телефон) человеку
 *    приходилось заново проходить полную регистрацию с фото, хотя он уже
 *    был в базе. Соответствующий новый экран "Вход" добавлен во фронтенде
 *    (App.html) — теперь стартовый экран для тех, кто не залогинен, это
 *    "Вход по телефону", а полная регистрация — только для новых
 *
 * Изменения v16 (сохранены) по сравнению с v15:
 *  - убрана вторая причина задержек (после v15 медленной оставалась не
 *    сама отметка, а проверка статуса при сканировании QR — она читала
 *    ВЕСЬ лист "Учет" в поисках последней записи телефона, и чем больше
 *    строк накапливалось, тем дольше сотрудник ждал появления кнопки
 *    "Приход"/"Уход" — те самые 13-20 секунд)
 *  - теперь "кто сейчас на смене и на каком объекте" хранится отдельно,
 *    в PropertiesService (getOpenShiftsMap_ / saveOpenShiftsMap_) —
 *    чтение и запись занимают доли секунды независимо от того, сколько
 *    всего строк в "Учет" накопилось за всё время
 *  - при первом обращении после обновления карта строится один раз по
 *    всей истории "Учет" автоматически (migrateOpenShiftsFromLog) — либо
 *    можно запустить это заранее вручную через новый пункт меню
 *    "Пересобрать статусы смен (разово, после обновления)"
 *  - logEvent теперь выполняется под блокировкой (LockService), чтобы две
 *    почти одновременные отметки не могли испортить эту карту
 *
 * Изменения v15 (сохранены) по сравнению с v14:
 *  - убран пересчёт всего листа "Аналитика" при каждой отметке
 *    прихода/ухода (это и было причиной задержки 10-20 секунд после
 *    нажатия кнопки — чем больше строк накапливалось в "Учет", тем дольше
 *    пересчитывался весь лист "Аналитика" целиком, и сотрудник ждал этого
 *    пересчёта, чтобы просто увидеть "Записано"). Личный кабинет
 *    (getMyStats) в "Аналитике" не нуждается — считает сам, по "Учет" —
 *    поэтому отметки остаются мгновенными.
 *  - добавлена функция setupAnalyticsTrigger() и пункт меню "Включить
 *    автообновление аналитики (раз)" — запускается один раз и настраивает
 *    автоматическое обновление листа "Аналитика" каждые 10 минут, без
 *    ручных действий администратора. Ручная кнопка "Обновить аналитику"
 *    в меню тоже осталась — на случай, если нужно увидеть цифры прямо сейчас.
 *
 * Изменения v14 (сохранены) по сравнению с v13:
 *  - защита от задвоения приходов/уходов и от входа на второй объект без
 *    выхода с первого. Теперь это проверяется на сервере (не только
 *    отключением кнопок во фронтенде, которое можно обойти обновлением
 *    страницы или вторым устройством):
 *      • нельзя отметить "Приход", если у сотрудника уже есть открытая
 *        смена на этом же объекте — сообщение "Вы уже отметили приход…"
 *      • нельзя отметить "Приход" на другом объекте, если не закрыта
 *        смена на предыдущем — сообщение с названием объекта, где нужно
 *        сначала отметить уход
 *      • нельзя отметить "Уход", если приход вообще не был отмечен
 *      • нельзя отметить "Уход" на объекте, отличном от того, где была
 *        открыта смена
 *  - новая функция getOpenShift(phone) — общая логика определения
 *    открытой смены, используется и в logEvent, и в getShiftStatus
 *  - getShiftStatus теперь дополнительно возвращает openObjectName —
 *    название объекта, на котором у сотрудника открыта смена (можно
 *    использовать во фронтенде, например для баннера)
 *
 * Изменения v13 (сохранены):
 *  - веб-приложение теперь само отдаёт страницу фронтенда (doGet без
 *    параметров возвращает HTML через HtmlService) — но у нас это не
 *    прижилось из-за ограничения Google (камера не работает в HtmlService,
 *    см. пояснение в чате), поэтому фронтенд снова хостится отдельно
 *    (сейчас — GitHub Pages), а этот backend используется только как API
 *  - список объектов, который раньше отдавался по обычному GET без
 *    параметров, теперь отдаётся по GET с параметром ?action=objects
 *    (сам фронтенд обновлён и запрашивает именно так — см. App.html)
 *
 * Изменения v12 (сохранены):
 *  - лист "Объекты" теперь может содержать график смен: колонки
 *    "Смена 1 начало", "Смена 1 конец", "Смена 2 начало", "Смена 2 конец"
 *    (время вводится вручную администратором как текст ЧЧ:ММ, смена может
 *    переходить через полночь, например 20:00 -> 07:00)
 *  - при отметке "Приход" вычисляется ближайшая по времени начала смена
 *    этого объекта и на основании неё считается опоздание в минутах
 *  - в "Учет" добавлена колонка "Опоздание (мин)" для каждой отметки прихода
 *  - "Аналитика" и личный кабинет (getMyStats) теперь возвращают опоздание
 *    по каждому дню и его сумму за месяц/всего, чтобы можно было показывать
 *    время прихода зелёным (вовремя) или красным (опоздание) во фронтенде
 *  - новое действие "status": по номеру телефона определяет, открыта ли
 *    сейчас смена сотрудника (последняя отметка "Приход" без "Ухода"),
 *    чтобы фронтенд мог отключать неподходящую кнопку (нельзя закончить
 *    смену, если она не начата, и наоборот)
 */

function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};

  // Запрос списка объектов от самого фронтенда (fetch(API_URL + '?action=objects'))
  if (params.action === 'objects') {
    return jsonOutput({ status: 'ok', objects: getValidObjects() });
  }

  // Обычное открытие ссылки в браузере — отдаём саму страницу приложения.
  // Файл "App.html" должен быть добавлен в проект Apps Script (см. инструкцию).
  return HtmlService.createHtmlOutputFromFile('App')
    .setTitle('SEVMOD — Учёт рабочего времени')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.action === 'register') {
      return jsonOutput(registerUser(data.name, data.phone, data.photo, data.googleIdToken));
    }
    if (data.action === 'login') {
      return jsonOutput(loginUser(data.phone));
    }
    if (data.action === 'log') {
      return jsonOutput(logEvent(data.name, data.phone, data.objectName, data.eventType, data.geo));
    }
    if (data.action === 'stats') {
      return jsonOutput(getMyStats(data.phone));
    }
    if (data.action === 'status') {
      return jsonOutput(getShiftStatus(data.phone));
    }
    if (data.action === 'adminCheckAccess') {
      return jsonOutput(adminCheckAccess(data.phone));
    }
    if (data.action === 'adminGetEmployees') {
      return jsonOutput(adminGetEmployees(data.phone));
    }
    if (data.action === 'adminSetRate') {
      return jsonOutput(adminSetRate(data.phone, data.targetPhone, data.rate));
    }
    if (data.action === 'adminGetAdminList') {
      return jsonOutput(adminGetAdminList(data.phone));
    }
    if (data.action === 'adminGetObjects') {
      return jsonOutput(adminGetObjects(data.phone));
    }
    if (data.action === 'adminAddObject') {
      return jsonOutput(adminAddObject(data.phone, data.name, data.address,
        data.shift1Start, data.shift1End, data.shift2Start, data.shift2End, data.foremanPhone));
    }
    if (data.action === 'adminUpdateObjectShifts') {
      return jsonOutput(adminUpdateObjectShifts(data.phone, data.objectName,
        data.shift1Start, data.shift1End, data.shift2Start, data.shift2End, data.foremanPhone));
    }
    if (data.action === 'adminCreateTask') {
      return jsonOutput(adminCreateTask(data.phone, data.targetPhone, data.name, data.objectName, data.text, data.photos));
    }
    if (data.action === 'adminGetTasks') {
      return jsonOutput(adminGetTasks(data.phone));
    }
    if (data.action === 'getMyTasks') {
      return jsonOutput(getMyTasks(data.phone));
    }
    if (data.action === 'getTaskById') {
      return jsonOutput(getTaskById(data.phone, data.taskId));
    }
    if (data.action === 'startTask') {
      return jsonOutput(startTask(data.phone, data.taskId, data.photos));
    }
    if (data.action === 'completeTask') {
      return jsonOutput(completeTask(data.phone, data.taskId, data.photos, data.comment));
    }
    if (data.action === 'submitAbsence') {
      return jsonOutput(submitAbsence(data.phone, data.kind, data.dateFrom, data.dateTo,
        data.timeFrom, data.timeTo, data.comment));
    }
    if (data.action === 'adminGetAbsences') {
      return jsonOutput(adminGetAbsences(data.phone));
    }
    if (data.action === 'adminAbsencePending') {
      return jsonOutput(adminAbsencePending(data.phone));
    }
    if (data.action === 'adminAddExpense') {
      return jsonOutput(adminAddExpense(data.phone, data.date, data.worker, data.brigadier,
        data.objectName, data.rate, data.comment, data.dateTo, data.entries, data.status));
    }
    if (data.action === 'adminExpenseOverview') {
      return jsonOutput(adminExpenseOverview(data.phone));
    }
    if (data.action === 'adminExpenseLookups') {
      return jsonOutput(adminExpenseLookups(data.phone));
    }
    if (data.action === 'adminDecideAbsence') {
      return jsonOutput(adminDecideAbsence(data.phone, data.id, data.decision));
    }
    if (data.action === 'getMyAbsences') {
      return jsonOutput(getMyAbsences(data.phone, data.year));
    }
    return jsonOutput({ status: 'error', message: 'Неизвестное действие' });

  } catch (err) {
    return jsonOutput({ status: 'error', message: String(err) });
  }
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Учёт времени')
    .addItem('Обновить аналитику', 'updateAnalytics')
    .addItem('Включить автообновление аналитики (раз)', 'setupAnalyticsTrigger')
    .addItem('Пересобрать статусы смен (разово, после обновления)', 'migrateOpenShiftsFromLog')
    .addItem('Включить автопрогрев скрипта (раз)', 'setupKeepWarmTrigger')
    .addItem('Включить автогеокодирование адресов объектов (раз)', 'setupObjectsGeocodeTrigger')
    .addItem('Геокодировать все адреса объектов (разово)', 'geocodeAllObjects')
    .addItem('Синхронизировать объекты с финдиром сейчас (разово)', 'syncObjectsWithFindirManual')
    .addItem('Включить автосинхронизацию объектов с финдиром (раз)', 'setupFindirSyncTrigger')
    .addItem('Отсортировать расходы по дате', 'sortExpensesByDateManual')
    .addItem('Включить строгие списки в расходах', 'applyExpenseStrictListsManual')
    .addToUi();
}

// Лёгкий "пинг" самого себя — не делает ничего полезного с данными, только
// не даёт Apps Script "усыпить" контейнер веб-приложения между реальными
// запросами от людей. Из-за этого "холодного старта" первый после паузы
// запрос (открытие приложения, вход, отметка) может занимать до 20-30
// секунд — это особенность самой платформы Apps Script, а не наш код.
// Регулярный самостоятельный "пинг" снижает вероятность попасть на такую
// паузу, хотя и не убирает её полностью.
function keepWarm() {
  try {
    UrlFetchApp.fetch(ScriptApp.getService().getUrl() + '?action=objects', {
      muteHttpExceptions: true
    });
  } catch (e) {
    // намеренно игнорируем — это фоновая задача, ошибка здесь ни на что
    // не влияет и не должна попадать в чьи-либо уведомления
  }
}

// Разовая настройка: запустить через меню "Учёт времени -> Включить
// автопрогрев скрипта (раз)". После этого keepWarm() будет вызываться
// каждые 5 минут сам по себе (повторный запуск функции безопасен —
// старый такой же триггер удаляется, дубликатов не будет).
function setupKeepWarmTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'keepWarm') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('keepWarm')
    .timeBased()
    .everyMinutes(5)
    .create();
}

// Разовая настройка автоматического обновления листа "Аналитика".
// Нужно запустить один раз — либо через меню "Учёт времени -> Включить
// автообновление аналитики (раз)" в самой таблице, либо один раз выбрать
// эту функцию в редакторе Apps Script и нажать "Выполнить" (может
// попросить выдать разрешения — это нормально, нужно разрешить).
// После этого лист "Аналитика" будет сам обновляться каждые 10 минут,
// и повторно запускать эту функцию не нужно (при повторном запуске старый
// такой же триггер удаляется, чтобы не создавать дубликаты).
function setupAnalyticsTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'updateAnalytics') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('updateAnalytics')
    .timeBased()
    .everyMinutes(10)
    .create();
}

function getValidObjects() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты');
  if (!sheet || sheet.getLastRow() < 2) return [];
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  return data.map(function (row) { return String(row[0]).trim(); }).filter(String);
}

// ===== GPS-привязка объектов (защита от "входа" по фото QR-кода издалека) =====
// Лист "Объекты": колонки B-E — расписание смен (см. getObjectShifts),
// колонка F — "Адрес" (вводит админ вручную, как обычный текст), колонки
// G/H — "Широта"/"Долгота" (заполняются САМИ, через геокодирование адреса,
// трогать руками не нужно), колонка I — "Статус геокодирования" (короткая
// подсказка админу, если с адресом что-то не так), колонка J —
// "Ответственный прораб" (хранит телефон, как и остальные ссылки на
// сотрудников в проекте; имя подтягивается из листа "Сотрудники").
var OBJ_COL = {
  NAME: 1, SHIFT1_START: 2, SHIFT1_END: 3, SHIFT2_START: 4, SHIFT2_END: 5,
  ADDRESS: 6, LAT: 7, LNG: 8, GEO_STATUS: 9, FOREMAN: 10
};

// Радиус (в метрах), в пределах которого отметка о приходе/уходе считается
// сделанной "на объекте". Объекты большие, поэтому заложен запас — цель не
// поймать человека, стоящего в 20 метрах от входа, а отсечь попытки
// отметиться за несколько километров (из дома и т.п.) по сфотографированному
// где-то ещё QR-коду. Чтобы изменить — поправьте это число и опубликуйте
// новую версию деплоя.
var GEO_RADIUS_METERS = 150;

// Если в "Объекты" ещё нет колонок для адреса/координат/прораба — создаёт
// заголовки. Существующие значения не трогает.
function ensureObjectGeoColumns_(sheet) {
  var headers = sheet.getRange(1, OBJ_COL.ADDRESS, 1, 4).getValues()[0];
  if (headers[0] !== 'Адрес') sheet.getRange(1, OBJ_COL.ADDRESS).setValue('Адрес');
  if (headers[1] !== 'Широта') sheet.getRange(1, OBJ_COL.LAT).setValue('Широта');
  if (headers[2] !== 'Долгота') sheet.getRange(1, OBJ_COL.LNG).setValue('Долгота');
  if (headers[3] !== 'Статус геокодирования') sheet.getRange(1, OBJ_COL.GEO_STATUS).setValue('Статус геокодирования');
  var foremanHeader = sheet.getRange(1, OBJ_COL.FOREMAN).getValue();
  if (foremanHeader !== 'Ответственный прораб') sheet.getRange(1, OBJ_COL.FOREMAN).setValue('Ответственный прораб');
}

// ===== Геокодирование адреса объекта (текст -> координаты) =====
//
// ВАЖНО для правильного результата при любом из способов ниже: объекты
// бывают в разных городах, у одной и той же улицы может быть полный тёзка
// в другом городе/области — геокодер не умеет угадывать, какой из них
// имелся в виду. Чтобы не промахнуться мимо города, в "Адрес" нужно писать
// адрес ПОЛНОСТЬЮ, обязательно включая город, например:
// "Самара, ул. Ленина, 10", а не просто "ул. Ленина, 10".
//
// Основной способ — Яндекс.Геокодер: заметно точнее знает российские
// адреса (особенно новостройки, бизнес-центры, нестандартные написания),
// чем бесплатный международный OpenStreetMap. Нужен свой бесплатный
// API-ключ:
//   1. Зайти на https://developer.tech.yandex.ru/ и войти через Яндекс ID.
//   2. Создать приложение, в списке API отметить "Геокодер HTTP API".
//   3. Скопировать выданный ключ (API-key) и сохранить его в свойствах
//      скрипта: редактор Apps Script → "Настройки проекта" (шестерёнка) →
//      "Свойства скрипта" → "Добавить свойство":
//        Свойство: YANDEX_GEOCODER_API_KEY
//        Значение: <ваш ключ>
//      Ключ НЕ хранится в коде, потому что код лежит в публичном репозитории.
var YANDEX_GEOCODER_API_KEY =
  PropertiesService.getScriptProperties().getProperty('YANDEX_GEOCODER_API_KEY') || '';
//
// Пока ключ не задан (свойства скрипта нет) — автоматически
// используется запасной вариант, бесплатный OpenStreetMap/Nominatim, без
// ключа, но менее точный для российских адресов. Как только ключ
// появится — переключение на Яндекс произойдёт само, ничего больше
// менять не нужно.

// Диагностика последней неудачной попытки геокодирования — чтобы при
// ошибке можно было написать в статусе ПОЧЕМУ не получилось (неверный
// ключ, адрес не найден, сбой сети и т.п.), а не просто "не удалось".
// Сбрасывается и заполняется заново при каждом вызове geocodeAddress_.
var lastYandexDebug_ = '';
var lastOsmDebug_ = '';

function geocodeAddress_(address) {
  lastYandexDebug_ = '';
  lastOsmDebug_ = '';
  if (YANDEX_GEOCODER_API_KEY) {
    var viaYandex = geocodeAddressYandex_(address);
    if (viaYandex) return viaYandex;
    // Яндекс не смог (сбой сети, нестандартный адрес и т.п.) — не
    // сдаёмся сразу, пробуем запасной вариант ниже.
  } else {
    lastYandexDebug_ = 'ключ не задан';
  }
  return geocodeAddressOsm_(address);
}

// Возвращает { lat, lon, displayName } или null, если адрес не распознан
// или ключ недействителен/исчерпана квота. Причина неудачи кладётся в
// lastYandexDebug_, чтобы её можно было показать администратору.
function geocodeAddressYandex_(address) {
  try {
    var url = 'https://geocode-maps.yandex.ru/1.x/' +
      '?apikey=' + encodeURIComponent(YANDEX_GEOCODER_API_KEY) +
      '&format=json&lang=ru_RU&results=1' +
      '&geocode=' + encodeURIComponent(address);
    var resp = UrlFetchApp.fetch(url, { method: 'get', muteHttpExceptions: true });
    var code = resp.getResponseCode();
    if (code !== 200) {
      // Самая частая причина: ключ создан не для того API. В кабинете
      // Яндекса для ключа должен быть отмечен именно "Геокодер HTTP API"
      // (а не "JavaScript API и HTTP Геокодер" из другого раздела, и не
      // "Статическое отображение"/"Карты") — иначе сервер отвечает 403.
      lastYandexDebug_ = 'HTTP ' + code + ': ' + String(resp.getContentText()).substring(0, 300);
      return null;
    }

    var data = JSON.parse(resp.getContentText());
    var members = data && data.response && data.response.GeoObjectCollection &&
      data.response.GeoObjectCollection.featureMember;
    if (!members || !members.length) {
      lastYandexDebug_ = 'Яндекс вернул 0 результатов для этого адреса';
      return null;
    }

    var geoObject = members[0].GeoObject;
    // У Яндекса координаты в формате "долгота широта" (через пробел) —
    // порядок обратный привычному, важно не перепутать при разборе.
    var parts = String(geoObject.Point.pos).trim().split(/\s+/);
    var lon = parseFloat(parts[0]);
    var lat = parseFloat(parts[1]);
    if (isNaN(lat) || isNaN(lon)) {
      lastYandexDebug_ = 'не удалось разобрать координаты в ответе Яндекса';
      return null;
    }

    var meta = geoObject.metaDataProperty && geoObject.metaDataProperty.GeocoderMetaData;
    var displayName = (meta && meta.text) || geoObject.name || '';
    return { lat: lat, lon: lon, displayName: displayName };
  } catch (e) {
    lastYandexDebug_ = 'ошибка запроса: ' + e.message;
    return null;
  }
}

// Запасной бесплатный геокодер (без ключа) — используется, пока не
// вставлен YANDEX_GEOCODER_API_KEY, либо если Яндекс не смог ответить.
// Причина неудачи кладётся в lastOsmDebug_.
function geocodeAddressOsm_(address) {
  try {
    var url = 'https://nominatim.openstreetmap.org/search' +
      '?format=json&limit=5&countrycodes=ru&addressdetails=0' +
      '&q=' + encodeURIComponent(address);
    var resp = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'SEVMOD-attendance-app (contact: ' + BOOTSTRAP_ADMIN_EMAIL + ')' }
    });
    var code = resp.getResponseCode();
    if (code !== 200) {
      lastOsmDebug_ = 'HTTP ' + code;
      return null;
    }
    var arr = JSON.parse(resp.getContentText());
    if (!arr || !arr.length) {
      lastOsmDebug_ = 'OSM вернул 0 результатов для этого адреса';
      return null;
    }

    // Из нескольких вариантов берём самый "значимый" (importance у
    // Nominatim) — так реже промахиваемся на малоизвестный одноимённый
    // объект вместо настоящего адреса.
    var best = arr[0];
    for (var i = 1; i < arr.length; i++) {
      if ((arr[i].importance || 0) > (best.importance || 0)) best = arr[i];
    }

    var lat = parseFloat(best.lat);
    var lon = parseFloat(best.lon);
    if (isNaN(lat) || isNaN(lon)) {
      lastOsmDebug_ = 'не удалось разобрать координаты в ответе OSM';
      return null;
    }
    return { lat: lat, lon: lon, displayName: best.display_name || '' };
  } catch (e) {
    lastOsmDebug_ = 'ошибка запроса: ' + e.message;
    return null;
  }
}

// Геокодирует одну строку листа "Объекты" (по номеру строки) и записывает
// результат в колонки Широта/Долгота/Статус. Общая логика для триггера
// (срабатывает при вводе адреса) и для ручного пересчёта всех адресов сразу.
function geocodeObjectRow_(sheet, row) {
  var address = String(sheet.getRange(row, OBJ_COL.ADDRESS).getValue() || '').trim();
  if (!address) {
    sheet.getRange(row, OBJ_COL.LAT, 1, 3).clearContent();
    return;
  }
  var coords = geocodeAddress_(address);
  if (coords) {
    sheet.getRange(row, OBJ_COL.LAT).setValue(coords.lat);
    sheet.getRange(row, OBJ_COL.LNG).setValue(coords.lon);
    // В статус пишем не просто "OK", а НАЙДЕННЫЙ адрес — чтобы сразу было
    // видно, тот ли это город/объект, а не пришлось отдельно проверять
    // координаты на карте. Если здесь виден не тот город — значит адрес
    // в ячейке нужно уточнить (дописать город полностью) и ввести заново.
    var shown = coords.displayName ? ('OK: ' + coords.displayName) : 'OK';
    sheet.getRange(row, OBJ_COL.GEO_STATUS).setValue(shown);
  } else {
    sheet.getRange(row, OBJ_COL.LAT, 1, 2).clearContent();
    // Пишем не просто "не удалось", а ПОЧЕМУ именно (ответ Яндекса и
    // ответ OSM) — это основной способ понять причину проблемы, не
    // копаясь в логах Apps Script.
    var reason = 'Не удалось распознать адрес. Яндекс: ' + (lastYandexDebug_ || '—') +
      ' | OSM: ' + (lastOsmDebug_ || '—');
    sheet.getRange(row, OBJ_COL.GEO_STATUS).setValue(reason);
  }
}

// Устанавливается один раз через меню "Учёт времени -> Включить
// автогеокодирование адресов объектов (раз)". После этого при вводе/
// изменении адреса в листе "Объекты" координаты подтягиваются сами —
// отдельный (не простой) триггер нужен специально для этого, потому что
// обращение к внешнему сервису геокодирования требует авторизации, которой
// у простых onEdit-триггеров нет.
function setupObjectsGeocodeTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'onEditGeocodeObjects') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('onEditGeocodeObjects')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
  // Заодно сразу создаём нужные колонки, чтобы не ждать первого редактирования.
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты');
  if (sheet) ensureObjectGeoColumns_(sheet);
}

function onEditGeocodeObjects(e) {
  try {
    if (!e || !e.range) return;
    var sheet = e.range.getSheet();
    if (sheet.getName() !== 'Объекты') return;

    var startCol = e.range.getColumn();
    var numCols = e.range.getNumColumns();
    if (OBJ_COL.ADDRESS < startCol || OBJ_COL.ADDRESS > startCol + numCols - 1) return;

    ensureObjectGeoColumns_(sheet);
    var startRow = e.range.getRow();
    var numRows = e.range.getNumRows();
    for (var i = 0; i < numRows; i++) {
      var row = startRow + i;
      if (row === 1) continue;
      geocodeObjectRow_(sheet, row);
    }
  } catch (err) {
    // Простые ограничения тут не действуют (это installable-триггер), но
    // всё равно не даём ошибке что-либо сломать в самой таблице.
  }
}

// Ручной пересчёт координат для ВСЕХ объектов сразу — пункт меню "Учёт
// времени -> Геокодировать все адреса объектов (разово)". Полезно один раз
// после того, как адреса уже были введены для нескольких объектов до того,
// как появилось автогеокодирование, либо если нужно обновить все разом.
function geocodeAllObjects() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты');
  if (!sheet || sheet.getLastRow() < 2) return;
  ensureObjectGeoColumns_(sheet);
  var lastRow = sheet.getLastRow();
  for (var row = 2; row <= lastRow; row++) {
    geocodeObjectRow_(sheet, row);
    Utilities.sleep(1100); // уважаем лимит Nominatim (~1 запрос в секунду)
  }
}

// ===== Двусторонняя синхронизация списка объектов с таблицей финдира =====
// Отдельный Google-файл (не наш), доступ по ID. Лист "Справочники",
// столбец B — там финдир ведёт собственный список объектов (и другие
// справочники в соседних столбцах, которые мы не трогаем). Скрипт
// выполняется от имени того, кто его запускает/у кого стоит триггер
// (tylermobiles@gmail.com) — у этого аккаунта должны быть права
// РЕДАКТОРА на таблицу финдира, иначе запись туда будет падать с ошибкой
// доступа.
var FINDIR_SPREADSHEET_ID = '1ANWNQc-pCiVS9xJxXbb5h9KWFjyG6Ajb-cVC4StkQQY';
var FINDIR_SHEET_NAME = 'Справочники';
var FINDIR_OBJECT_COLUMN = 2; // B

// Читает текущий список названий объектов у финдира (столбец B, начиная со
// второй строки — в первой у неё заголовок "Объект"). Возвращает
// { sheet, names } — sheet пригодится, чтобы потом дописать туда новые
// строки; null в sheet, если лист переименован/удалён (тихо пропускаем
// синхронизацию в этом случае, а не ломаем всё остальное).
function getFindirObjectNames_() {
  var ss = SpreadsheetApp.openById(FINDIR_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(FINDIR_SHEET_NAME);
  if (!sheet) return { sheet: null, names: [] };
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { sheet: sheet, names: [] };
  var values = sheet.getRange(2, FINDIR_OBJECT_COLUMN, lastRow - 1, 1).getValues();
  var names = values
    .map(function (row) { return String(row[0]).replace(/\s+/g, ' ').trim(); })
    .filter(String);
  return { sheet: sheet, names: names };
}

// Дописывает названия в конец столбца B листа финдира. Важно: не берём
// общий sheet.getLastRow() листа "Справочники" — соседние столбцы (виды
// деятельности, контрагенты и т.п.) намного длиннее столбца B, так что
// общий "последний ряд" тут не подходит — ищем последнюю занятую ячейку
// именно в столбце B.
function appendFindirObjectNames_(findirSheet, namesToAdd) {
  if (!namesToAdd.length) return;
  var colValues = findirSheet.getRange(1, FINDIR_OBJECT_COLUMN, findirSheet.getMaxRows(), 1).getValues();
  var lastUsedRow = 1;
  for (var i = 0; i < colValues.length; i++) {
    if (String(colValues[i][0]).trim()) lastUsedRow = i + 1;
  }
  var startRow = lastUsedRow + 1;
  findirSheet.getRange(startRow, FINDIR_OBJECT_COLUMN, namesToAdd.length, 1)
    .setValues(namesToAdd.map(function (n) { return [n]; }));
}

// Основная сверка: объект, которого нет у нас, но есть у финдира —
// добавляем себе (только название, без адреса — его дозаполнит админ в
// экране "Объекты" или в самой таблице); объект, которого нет у неё, но
// есть у нас — дописываем в конец её столбца B. Возвращает счётчики для
// ручного запуска (см. syncObjectsWithFindirManual). Не трогает ничего,
// кроме названий объектов — ни адреса, ни смены, ни другие её столбцы.
function syncObjectsWithFindir_() {
  var ourSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты');
  if (!ourSheet) return { addedHere: 0, addedThere: 0 };
  ensureObjectGeoColumns_(ourSheet);

  var ourNames = getValidObjects();
  var ourNamesSet = {};
  ourNames.forEach(function (n) { ourNamesSet[n] = true; });

  var findir = getFindirObjectNames_();
  if (!findir.sheet) return { addedHere: 0, addedThere: 0 };
  var findirNamesSet = {};
  findir.names.forEach(function (n) { findirNamesSet[n] = true; });

  var toAddHere = findir.names.filter(function (n) { return !ourNamesSet[n]; });
  toAddHere.forEach(function (name) {
    var newRow = ourSheet.getLastRow() + 1;
    ourSheet.getRange(newRow, OBJ_COL.NAME).setValue(name);
  });

  var toAddThere = ourNames.filter(function (n) { return !findirNamesSet[n]; });
  appendFindirObjectNames_(findir.sheet, toAddThere);

  return { addedHere: toAddHere.length, addedThere: toAddThere.length };
}

// Безопасная обёртка для триггера по расписанию и для вызова сразу после
// adminAddObject — глушит ошибки (например, временную недоступность файла
// финдира), чтобы сбой синхронизации не ломал ни обычную отметку, ни
// добавление объекта из приложения. Следующий запуск (через 10 минут или
// при следующем добавлении объекта) просто попробует снова.
function syncObjectsWithFindirSafe_() {
  try {
    syncObjectsWithFindir_();
  } catch (e) {
    // намеренно игнорируем
  }
}

// Пункт меню "Синхронизировать объекты с финдиром сейчас (разово)" — в
// отличие от syncObjectsWithFindirSafe_, показывает результат во
// всплывающем окне. Первый запуск должен быть именно отсюда (вручную, из
// редактора Apps Script) — Google при первом обращении к ЧУЖОЙ таблице по
// ID потребует подтвердить расширенный доступ, а у триггера по расписанию
// спросить это не у кого.
function syncObjectsWithFindirManual() {
  try {
    var result = syncObjectsWithFindir_();
    SpreadsheetApp.getUi().alert(
      'Синхронизация с финдиром выполнена.\n' +
      'Добавлено к нам: ' + result.addedHere + '\n' +
      'Добавлено у финдира: ' + result.addedThere
    );
  } catch (e) {
    SpreadsheetApp.getUi().alert('Не удалось синхронизировать: ' + e);
  }
}

// Пункт меню "Включить автосинхронизацию объектов с финдиром (раз)" —
// ставит триггер по расписанию (каждые 10 минут), который подтягивает
// объекты, добавленные прямо в таблице (не через приложение) с любой из
// сторон. Добавление объекта из приложения синхронизируется сразу же
// отдельно (см. adminAddObject) и не ждёт этот триггер.
function setupFindirSyncTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'syncObjectsWithFindirSafe_') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('syncObjectsWithFindirSafe_')
    .timeBased()
    .everyMinutes(10)
    .create();
}

// Координаты объекта по названию, либо null, если их ещё нет (адрес не
// заполнен или не удалось распознать) — в этом случае GPS-проверка для
// такого объекта просто не делается (см. logEvent), чтобы не блокировать
// отметки там, где администратор ещё не указал адрес.
function getObjectCoords_(objectName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты');
  if (!sheet || sheet.getLastRow() < 2) return null;
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(2, 1, lastRow - 1, OBJ_COL.LNG).getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][OBJ_COL.NAME - 1]).trim() === objectName) {
      var lat = parseFloat(data[i][OBJ_COL.LAT - 1]);
      var lng = parseFloat(data[i][OBJ_COL.LNG - 1]);
      if (isNaN(lat) || isNaN(lng)) return null;
      return { lat: lat, lng: lng };
    }
  }
  return null;
}

// Расстояние между двумя точками на Земле в метрах (формула гаверсинуса).
function haversineMeters_(lat1, lon1, lat2, lon2) {
  var R = 6371000;
  var toRad = function (d) { return d * Math.PI / 180; };
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Расстояние для показа человеку: в метрах короткие значения читаются
// нормально, а вот "2734 м" воспринимается хуже, чем "2.7 км" — поэтому от
// 1000 м и дальше переключаемся на километры с одним знаком после запятой.
function formatDistanceMeters_(meters) {
  if (meters >= 1000) {
    return (Math.round(meters / 100) / 10) + ' км';
  }
  return meters + ' м';
}

// Обратное геокодирование (координаты -> ближайший адрес) — для аудита
// несанкционированных попыток: удобнее сразу видеть адрес в таблице, чем
// каждый раз вручную вбивать координаты на карту. Тот же принцип, что и у
// geocodeAddress_: сначала Яндекс (если задан ключ), иначе/при сбое — OSM.
// Возвращает строку адреса или '', если не удалось определить.
function reverseGeocodeAddress_(lat, lng) {
  if (YANDEX_GEOCODER_API_KEY) {
    var viaYandex = reverseGeocodeYandex_(lat, lng);
    if (viaYandex) return viaYandex;
  }
  return reverseGeocodeOsm_(lat, lng);
}

function reverseGeocodeYandex_(lat, lng) {
  try {
    var url = 'https://geocode-maps.yandex.ru/1.x/' +
      '?apikey=' + encodeURIComponent(YANDEX_GEOCODER_API_KEY) +
      '&format=json&lang=ru_RU&results=1&kind=house' +
      // здесь у Яндекса порядок обратный обычному: "долгота,широта"
      '&geocode=' + encodeURIComponent(lng + ',' + lat);
    var resp = UrlFetchApp.fetch(url, { method: 'get', muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) return '';
    var data = JSON.parse(resp.getContentText());
    var members = data && data.response && data.response.GeoObjectCollection &&
      data.response.GeoObjectCollection.featureMember;
    if (!members || !members.length) return '';
    var geoObject = members[0].GeoObject;
    var meta = geoObject.metaDataProperty && geoObject.metaDataProperty.GeocoderMetaData;
    return (meta && meta.text) || geoObject.name || '';
  } catch (e) {
    return '';
  }
}

function reverseGeocodeOsm_(lat, lng) {
  try {
    var url = 'https://nominatim.openstreetmap.org/reverse' +
      '?format=json&lat=' + encodeURIComponent(lat) +
      '&lon=' + encodeURIComponent(lng) + '&zoom=18&addressdetails=0';
    var resp = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'SEVMOD-attendance-app (contact: ' + BOOTSTRAP_ADMIN_EMAIL + ')' }
    });
    if (resp.getResponseCode() !== 200) return '';
    var data = JSON.parse(resp.getContentText());
    return (data && data.display_name) || '';
  } catch (e) {
    return '';
  }
}

// Лист для аудита заблокированных попыток (вне радиуса объекта) — чтобы
// админ при желании мог посмотреть, кто и когда пытался отметиться не на
// месте. Создаётся сам при первой такой попытке.
function logGeoBlockedAttempt_(name, phone, objectName, eventType, geo, distanceMeters) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Попытки вне объекта');
    if (!sheet) {
      sheet = ss.insertSheet('Попытки вне объекта');
      sheet.appendRow(['Дата и время', 'ФИО', 'Телефон', 'Объект', 'Тип события', 'Расстояние (м)', 'Широта', 'Долгота', 'Ближайший адрес']);
    } else if (sheet.getLastColumn() < 9 || sheet.getRange(1, 9).getValue() !== 'Ближайший адрес') {
      // Лист уже существовал (создан до этой версии) — просто дописываем
      // недостающий заголовок новой колонки, не трогая остальные данные.
      sheet.getRange(1, 9).setValue('Ближайший адрес');
    }
    // Обратное геокодирование делается здесь же, синхронно — попытка уже
    // отклонена и эта запись лишь для последующего просмотра админом, так
    // что секунда-другая на запрос к геокодеру ни на что не влияет.
    var nearestAddress = geo ? reverseGeocodeAddress_(geo.lat, geo.lng) : '';
    sheet.appendRow([
      new Date(), name, phone, objectName, eventType, distanceMeters,
      geo ? geo.lat : '', geo ? geo.lng : '', nearestAddress
    ]);
  } catch (e) {
    // аудит не критичен — если не получилось записать, саму отметку это
    // блокировать не должно (она и так уже отклонена выше)
  }
}

// Читает график смен объектов из листа "Объекты".
// Ожидаемые колонки: A - Название объекта, B - Смена 1 начало, C - Смена 1 конец,
// D - Смена 2 начало, E - Смена 2 конец (время как текст "ЧЧ:ММ", может отсутствовать)
// Возвращает { "Название объекта": [ {start:"10:00", end:"19:00"}, {start:"20:00", end:"07:00"} ] }
function getObjectShifts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты');
  var shiftsByObject = {};
  if (!sheet || sheet.getLastRow() < 2) return shiftsByObject;

  var lastCol = Math.max(sheet.getLastColumn(), 5);
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, lastCol).getValues();

  data.forEach(function (row) {
    var name = String(row[0]).trim();
    if (!name) return;

    var shifts = [];
    var pairs = [[row[1], row[2]], [row[3], row[4]]];
    pairs.forEach(function (pair) {
      var start = normalizeTimeStr(pair[0]);
      var end = normalizeTimeStr(pair[1]);
      if (start && end) shifts.push({ start: start, end: end });
    });
    shiftsByObject[name] = shifts;
  });

  return shiftsByObject;
}

// Приводит значение ячейки ко времени "ЧЧ:ММ" (строка) или null, если пусто/некорректно.
// Поддерживает и текстовый ввод "8:00", и то, что Таблицы могут превратить в объект Date.
function normalizeTimeStr(value) {
  if (!value && value !== 0) return null;
  if (value instanceof Date) {
    return Utilities.formatDate(value, 'Europe/Moscow', 'HH:mm');
  }
  var str = String(value).trim();
  if (!str) return null;
  var m = str.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  var hh = ('0' + m[1]).slice(-2);
  var mm = m[2];
  return hh + ':' + mm;
}

// Переводит "ЧЧ:ММ" в число минут от начала суток
function timeStrToMinutes(timeStr) {
  var parts = timeStr.split(':');
  return Number(parts[0]) * 60 + Number(parts[1]);
}

// По времени прихода (Date) и списку смен объекта находит ближайшую по времени начала
// смену (с учётом того, что смена может начинаться поздно вечером) и возвращает
// { shiftStart: "ЧЧ:ММ", lateMinutes: число (может быть отрицательным, если пришёл раньше) }.
// Если у объекта не задано ни одной смены, возвращает null.
function findNearestShift(arrivalDate, shifts) {
  if (!shifts || shifts.length === 0) return null;

  var arrivalMinutes = arrivalDate.getHours() * 60 + arrivalDate.getMinutes();

  var best = null;
  var bestDiff = null;

  shifts.forEach(function (shift) {
    var shiftStartMinutes = timeStrToMinutes(shift.start);

    // расстояние по кругу суток (0..1440), чтобы полночь не считалась "далеко"
    var diff = Math.abs(arrivalMinutes - shiftStartMinutes);
    if (diff > 720) diff = 1440 - diff;

    if (bestDiff === null || diff < bestDiff) {
      bestDiff = diff;
      best = shift;
    }
  });

  var shiftStartMinutes = timeStrToMinutes(best.start);
  // опоздание считаем с учётом перехода через полночь: берём разницу по кратчайшему пути,
  // но со знаком - положительная разница значит "пришёл позже начала смены"
  var lateMinutes = arrivalMinutes - shiftStartMinutes;
  if (lateMinutes > 720) lateMinutes -= 1440;
  if (lateMinutes < -720) lateMinutes += 1440;

  return { shiftStart: best.start, lateMinutes: lateMinutes };
}

// Читает ставки сотрудников из листа "Сотрудники" (колонка E — "Ставка")
function getEmployeeRates() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
  var rates = {};
  if (!sheet || sheet.getLastRow() < 2) return rates;
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  data.forEach(function (row) {
    var name = row[0];
    var rate = row[4];
    if (name) rates[name] = Number(rate) || 0;
  });
  return rates;
}

// Приводит номер телефона к виду "только цифры" — убирает "+", пробелы,
// скобки, дефисы и т.п. Это решает сразу две проблемы:
//  1) Google Таблицы иногда пытаются прочитать значение, начинающееся с
//     "+" и содержащее скобки/дефисы (например "+7 (962) 684-47-16"),
//     как формулу — и падают в "Синтаксическая ошибка в формуле"
//     (#ERROR!). Форматирование ячейки как текст это НЕ предотвращает —
//     проверено на практике, ошибка всё равно возникает. Единственный
//     надёжный способ — вообще не класть в ячейку подобные символы.
//  2) Один и тот же номер, введённый в разном виде в разных местах
//     (с красивым форматированием на одном экране и без — на другом),
//     должен всё равно считаться одним и тем же номером при сравнении.
// Применяется everywhere, где номер телефона приходит от пользователя —
// и при сохранении, и при сравнении с уже сохранёнными (в том числе
// старыми, ещё "грязными") значениями.
function normalizePhone_(phone) {
  return String(phone || '').replace(/\D/g, '');
}

// ЗАМЕНИТЕ на тот же Client ID, что указан в App.html (константа
// GOOGLE_CLIENT_ID там). Он должен совпадать в обоих местах — backend
// проверяет, что токен от Google выпущен именно для этого приложения.
var GOOGLE_CLIENT_ID = '540820593622-782iqaj43ksklngqmlgr2r0vigrae7m0.apps.googleusercontent.com';

// Проверяет ID-токен, полученный от Google Identity Services во фронтенде.
// Проверка идёт НЕ на доверии к тому, что прислал браузер, а через
// собственный сервис Google (tokeninfo) — он сам проверяет цифровую подпись
// токена и возвращает данные, только если токен подлинный и не истёк.
// Подделать это с фронтенда нельзя, в отличие от, например, обычного поля
// формы. Возвращает email при успехе, либо null при любой проблеме.
function verifyGoogleIdToken_(idToken) {
  if (!idToken) return null;
  try {
    var resp = UrlFetchApp.fetch(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
      { muteHttpExceptions: true }
    );
    if (resp.getResponseCode() !== 200) return null;

    var payload = JSON.parse(resp.getContentText());

    // aud должен совпадать с нашим Client ID — иначе это токен от другого
    // приложения, а не от нашей формы регистрации.
    if (payload.aud !== GOOGLE_CLIENT_ID) return null;
    // email_verified у Google в tokeninfo приходит строкой "true"/"false"
    if (payload.email_verified !== 'true' && payload.email_verified !== true) return null;
    if (!payload.email) return null;

    return payload.email;
  } catch (e) {
    return null;
  }
}

// ===== Панель администратора =====
// Права выдаются галочкой в столбце "Админ" (колонка G) листа
// "Сотрудники" — прямо в таблице, без отдельного экрана в приложении.
// Этот email всегда админ "по умолчанию" (нужен для самого первого
// входа, пока ни у кого ещё не стоит галочка) и его нельзя снять.
var BOOTSTRAP_ADMIN_EMAIL = 'tylermobiles@gmail.com';

// Если в листе "Сотрудники" ещё нет столбца "Админ" — создаёт его (колонка
// G) и сразу делает ячейки существующих строк чекбоксами (по умолчанию не
// отмечены). Если столбец уже существует — ничего не трогает, чтобы не
// затирать уже проставленные галочки.
function ensureAdminColumn_(sheet) {
  var header = sheet.getRange(1, 7).getValue();
  if (header === 'Админ') return;
  sheet.getRange(1, 7).setValue('Админ');
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    sheet.getRange(2, 7, lastRow - 1, 1).insertCheckboxes();
  }
}

// Лист "Администраторы" больше НЕ используется для проверки прав (это
// решает галочка в "Сотрудники", см. isAdminPhone_ ниже) — он существует
// только как читаемое зеркало "кто сейчас админ", чтобы не приходилось
// открывать приложение, чтобы это увидеть. Заполняется и обновляется
// автоматически: полностью пересобирается при каждом открытии панели
// администратора (adminGetAdminList) и мгновенно обновляется при самой
// установке/снятии галочки в "Сотрудники" (см. onEdit ниже).
function getOrCreateAdminMirrorSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Администраторы');
  if (!sheet) {
    sheet = ss.insertSheet('Администраторы');
    sheet.getRange(1, 1).setValue('Email');
  }
  return sheet;
}

// Полностью перезаписывает лист списком админов целиком — проще и
// надёжнее, чем точечно добавлять/убирать строки, и само чинит любые
// расхождения (например, если галочки стояли ещё до появления этой
// синхронизации).
function rebuildAdminMirrorSheet_(admins) {
  var sheet = getOrCreateAdminMirrorSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    sheet.getRange(2, 1, lastRow - 1, 1).clearContent();
  }
  if (admins.length) {
    sheet.getRange(2, 1, admins.length, 1).setValues(admins.map(function (e) { return [e]; }));
  }
}

// Точечно добавляет/убирает один email из листа-зеркала — используется из
// onEdit сразу после установки/снятия галочки, для мгновенного отклика
// без ожидания следующего открытия панели администратора.
function syncAdminMirrorSheet_(email, shouldBeAdmin) {
  var sheet = getOrCreateAdminMirrorSheet_();
  var normalized = String(email).trim().toLowerCase();
  var lastRow = sheet.getLastRow();
  var existingRow = -1;
  if (lastRow >= 2) {
    var emails = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < emails.length; i++) {
      if (String(emails[i][0]).trim().toLowerCase() === normalized) {
        existingRow = i + 2;
        break;
      }
    }
  }
  if (shouldBeAdmin && existingRow === -1) {
    sheet.appendRow([email]);
  } else if (!shouldBeAdmin && existingRow !== -1) {
    sheet.deleteRow(existingRow);
  }
}

// Простой триггер Apps Script — срабатывает САМ, автоматически, при любом
// ручном редактировании таблицы человеком (ничего включать в меню не
// нужно). Реагирует только на изменения в столбце "Админ" (G) листа
// "Сотрудники" — сразу добавляет/убирает email в "Администраторы".
// Простые триггеры не должны "выбрасывать" ошибку наружу, поэтому всё в
// try/catch: если что-то пошло не так, просто ничего не делаем — это не
// критично, лист всё равно досинхронизируется при следующем открытии
// панели администратора (см. rebuildAdminMirrorSheet_).
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    var sheet = e.range.getSheet();
    if (sheet.getName() !== 'Сотрудники') return;

    var startCol = e.range.getColumn();
    var numCols = e.range.getNumColumns();
    if (7 < startCol || 7 > startCol + numCols - 1) return; // колонка G не затронута

    var startRow = e.range.getRow();
    var numRows = e.range.getNumRows();
    for (var r = startRow; r < startRow + numRows; r++) {
      if (r < 2) continue; // заголовок
      var email = String(sheet.getRange(r, 6).getValue() || '').trim(); // F — Email
      if (!email) continue;
      var checked = sheet.getRange(r, 7).getValue() === true; // G — Админ
      syncAdminMirrorSheet_(email, checked);
    }
  } catch (err) {
    // намеренно игнорируем — см. комментарий выше
  }
}

// Проверка прав администратора по номеру телефона (а не по Google-
// аккаунту) — см. adminAuth_ ниже для контекста, почему это сделано так.
// Галочка "Админ" (колонка G) в "Сотрудники" — ЕДИНСТВЕННЫЙ источник прав,
// без исключений (в том числе для BOOTSTRAP_ADMIN_EMAIL — раньше тут была
// отдельная "защита владельца от самого себя", её убрали по просьбе:
// теперь галочку можно снять с кого угодно, включая себя, и доступ
// пропадёт по-настоящему). Если случайно снимете её с себя — вернуть
// доступ можно только вручную в самой таблице, приложение в этом уже не
// поможет.
function isAdminPhone_(phone) {
  var normalizedPhone = normalizePhone_(phone);
  if (!normalizedPhone) return false;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
  if (!sheet || sheet.getLastRow() < 2) return false;
  ensureAdminColumn_(sheet);

  // B — Телефон (2) ... G — Админ (7): берём весь диапазон B:G одним чтением.
  var data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 6).getValues();
  for (var i = 0; i < data.length; i++) {
    if (normalizePhone_(data[i][0]) === normalizedPhone) {
      var checked = data[i][5] === true || String(data[i][5]).trim().toUpperCase() === 'TRUE';
      return checked;
    }
  }
  return false;
}

// Проверяет права администратора по номеру телефона, с которым человек
// сейчас вошёл в приложение (обычный вход по телефону, без пароля). Раньше
// здесь дополнительно требовался Google-вход — убрали по просьбе: теперь
// галочка "Админ" в "Сотрудники" — единственный источник прав, никакого
// повторного подтверждения при каждом входе в панель администратора.
// Все adminXxx-функции ниже начинаются с этой проверки.
function adminAuth_(phone) {
  var normalizedPhone = normalizePhone_(phone);
  if (!normalizedPhone) {
    return { ok: false, error: 'Не удалось определить ваш номер телефона. Попробуйте войти заново.' };
  }
  if (!isAdminPhone_(normalizedPhone)) {
    return { ok: false, error: 'У этого номера нет прав администратора.' };
  }
  return { ok: true, phone: normalizedPhone };
}

function adminCheckAccess(phone) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };
  return { status: 'ok' };
}

function adminGetEmployees(phone) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
  if (!sheet || sheet.getLastRow() < 2) return { status: 'ok', employees: [] };

  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
  var employees = data
    .filter(function (row) { return row[0]; })
    .map(function (row) {
      return {
        name: row[0],
        // Нормализуем и здесь — чтобы в выпадающем списке "Исполнитель" и
        // при постановке задачи везде ходил чистый номер, без "красивого"
        // форматирования, которое могло когда-то попасть в таблицу и
        // вызывать ошибку формулы при записи в другой лист.
        phone: normalizePhone_(row[1]),
        rate: Number(row[4]) || 0,
        email: row[5] || ''
      };
    });
  return { status: 'ok', employees: employees };
}

function adminSetRate(adminPhone, targetPhone, rate) {
  var auth = adminAuth_(adminPhone);
  if (!auth.ok) return { status: 'error', message: auth.error };

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
  if (!sheet || sheet.getLastRow() < 2) {
    return { status: 'error', message: 'Сотрудник не найден' };
  }
  var normalizedPhone = normalizePhone_(targetPhone);
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  for (var i = 0; i < data.length; i++) {
    if (normalizePhone_(data[i][1]) === normalizedPhone) {
      var numericRate = Number(rate);
      if (isNaN(numericRate) || numericRate < 0) {
        return { status: 'error', message: 'Некорректная ставка' };
      }
      sheet.getRange(i + 2, 5).setValue(numericRate);
      return { status: 'ok' };
    }
  }
  return { status: 'error', message: 'Сотрудник с таким номером не найден' };
}

// Отдаёт текущий список администраторов — только для чтения. Сами права
// теперь назначаются галочкой "Админ" прямо в листе "Сотрудники", этот
// список лишь показывает в панели, у кого сейчас эти права стоят.
function adminGetAdminList(phone) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };

  // Раньше BOOTSTRAP_ADMIN_EMAIL всегда попадал в список, даже без
  // галочки — теперь список строго отражает реальные права (только
  // отмеченные галочкой), см. isAdminPhone_.
  var admins = [];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
  if (sheet && sheet.getLastRow() >= 2) {
    ensureAdminColumn_(sheet);
    var data = sheet.getRange(2, 6, sheet.getLastRow() - 1, 2).getValues(); // F=Email, G=Админ
    data.forEach(function (row) {
      var email = String(row[0]).trim();
      var checked = row[1] === true || String(row[1]).trim().toUpperCase() === 'TRUE';
      if (checked && email && admins.indexOf(email) === -1) admins.push(email);
    });
  }

  // Заодно досинхронизируем лист-зеркало "Администраторы" — это чинит
  // любые расхождения (например, галочки, стоявшие ещё до появления
  // синхронизации через onEdit), не только мгновенные изменения.
  rebuildAdminMirrorSheet_(admins);

  return { status: 'ok', admins: admins, bootstrapAdmin: BOOTSTRAP_ADMIN_EMAIL };
}

// ===== Управление списком объектов из панели администратора =====
// Раньше объекты можно было только смотреть/добавлять прямо в таблице.
// Эти действия дают сделать то же самое из приложения — список, добавление
// нового объекта и настройка расписания смен + ответственного прораба (как
// для нового, так и для уже существующих объектов) — в панели
// администратора.

// Ищет сотрудника по телефону в листе "Сотрудники" — используется, чтобы
// подставить имя прораба рядом с его телефоном (хранится именно телефон,
// как и везде в проекте — имя может измениться, номер нет) и чтобы
// проверить, что выбранный телефон вообще принадлежит сотруднику.
function findEmployeeByPhone_(phone) {
  var normalizedPhone = normalizePhone_(phone);
  if (!normalizedPhone) return null;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
  if (!sheet || sheet.getLastRow() < 2) return null;
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  for (var i = 0; i < data.length; i++) {
    if (normalizePhone_(data[i][1]) === normalizedPhone) {
      return { name: data[i][0], phone: normalizedPhone };
    }
  }
  return null;
}

// Отдаёт список всех объектов с адресом, текущим статусом геокодирования
// (тем же, что виден в колонке "Статус геокодирования" листа "Объекты"),
// расписанием смен и ответственным прорабом — чтобы в приложении сразу
// было видно и что не настроено, и кто за что отвечает.
function adminGetObjects(phone) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты');
  if (!sheet || sheet.getLastRow() < 2) return { status: 'ok', objects: [] };
  ensureObjectGeoColumns_(sheet);

  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(2, 1, lastRow - 1, OBJ_COL.FOREMAN).getValues();
  var objects = data
    .filter(function (row) { return String(row[OBJ_COL.NAME - 1]).trim(); })
    .map(function (row) {
      var foremanPhone = normalizePhone_(row[OBJ_COL.FOREMAN - 1]);
      var foreman = foremanPhone ? findEmployeeByPhone_(foremanPhone) : null;
      return {
        name: String(row[OBJ_COL.NAME - 1]).trim(),
        shift1Start: normalizeTimeStr(row[OBJ_COL.SHIFT1_START - 1]) || '',
        shift1End: normalizeTimeStr(row[OBJ_COL.SHIFT1_END - 1]) || '',
        shift2Start: normalizeTimeStr(row[OBJ_COL.SHIFT2_START - 1]) || '',
        shift2End: normalizeTimeStr(row[OBJ_COL.SHIFT2_END - 1]) || '',
        address: String(row[OBJ_COL.ADDRESS - 1] || '').trim(),
        lat: row[OBJ_COL.LAT - 1] || '',
        lng: row[OBJ_COL.LNG - 1] || '',
        geoStatus: String(row[OBJ_COL.GEO_STATUS - 1] || '').trim(),
        foremanPhone: foremanPhone || '',
        foremanName: foreman ? foreman.name : ''
      };
    });
  return { status: 'ok', objects: objects };
}

// Проверяет и приводит к виду "ЧЧ:ММ" время смены, введённое в приложении.
// Пустая строка — это "не задано" (допустимо, смена тогда просто не
// участвует в определении опозданий, как и раньше при пустой ячейке).
// Возвращает { ok: true, value } или { ok: false, error }.
function validateShiftTime_(value, label) {
  var trimmed = String(value || '').trim();
  if (!trimmed) return { ok: true, value: '' };
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed)) {
    return { ok: false, error: label + ': неверный формат времени, используйте ЧЧ:ММ (например 08:00)' };
  }
  return { ok: true, value: trimmed };
}

// Общая запись расписания смен + прораба в строку объекта — используется и
// при добавлении нового объекта, и при редактировании существующего.
// Возвращает { ok: true } или { ok: false, error }.
function writeObjectShiftsAndForeman_(sheet, row, shift1Start, shift1End, shift2Start, shift2End, foremanPhone) {
  var s1s = validateShiftTime_(shift1Start, 'Смена 1, начало');
  if (!s1s.ok) return s1s;
  var s1e = validateShiftTime_(shift1End, 'Смена 1, конец');
  if (!s1e.ok) return s1e;
  var s2s = validateShiftTime_(shift2Start, 'Смена 2, начало');
  if (!s2s.ok) return s2s;
  var s2e = validateShiftTime_(shift2End, 'Смена 2, конец');
  if (!s2e.ok) return s2e;

  var normalizedForemanPhone = '';
  var trimmedForeman = String(foremanPhone || '').trim();
  if (trimmedForeman) {
    var foreman = findEmployeeByPhone_(trimmedForeman);
    if (!foreman) {
      return { ok: false, error: 'Сотрудник-прораб с таким телефоном не найден' };
    }
    normalizedForemanPhone = foreman.phone;
  }

  sheet.getRange(row, OBJ_COL.SHIFT1_START).setValue(s1s.value);
  sheet.getRange(row, OBJ_COL.SHIFT1_END).setValue(s1e.value);
  sheet.getRange(row, OBJ_COL.SHIFT2_START).setValue(s2s.value);
  sheet.getRange(row, OBJ_COL.SHIFT2_END).setValue(s2e.value);
  sheet.getRange(row, OBJ_COL.FOREMAN).setValue(normalizedForemanPhone);
  return { ok: true };
}

// Добавляет новую строку в лист "Объекты" (название, адрес, расписание
// смен, прораб) и сразу же геокодирует адрес, если он указан — так что
// координаты для GPS-проверки появляются сразу, не дожидаясь следующего
// открытия таблицы или ручного запуска "Геокодировать все адреса объектов".
function adminAddObject(adminPhone, name, address, shift1Start, shift1End, shift2Start, shift2End, foremanPhone) {
  var auth = adminAuth_(adminPhone);
  if (!auth.ok) return { status: 'error', message: auth.error };

  var trimmedName = String(name || '').trim();
  if (!trimmedName) {
    return { status: 'error', message: 'Укажите название объекта' };
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты');
  if (!sheet) {
    return { status: 'error', message: 'В таблице нет листа "Объекты" — создайте его вручную' };
  }
  ensureObjectGeoColumns_(sheet);

  if (sheet.getLastRow() >= 2) {
    var existingNames = sheet.getRange(2, OBJ_COL.NAME, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < existingNames.length; i++) {
      if (String(existingNames[i][0]).trim() === trimmedName) {
        return { status: 'error', message: 'Объект с таким названием уже есть' };
      }
    }
  }

  var newRow = sheet.getLastRow() + 1;
  sheet.getRange(newRow, OBJ_COL.NAME).setValue(trimmedName);

  var written = writeObjectShiftsAndForeman_(sheet, newRow, shift1Start, shift1End, shift2Start, shift2End, foremanPhone);
  if (!written.ok) {
    // Строка с названием уже создана (чтобы не потерять порядок/ID) — но
    // раз расписание не записалось, чистим её целиком и сообщаем об ошибке,
    // а не оставляем наполовину заполненный объект.
    sheet.deleteRow(newRow);
    return { status: 'error', message: written.error };
  }

  var trimmedAddress = String(address || '').trim();
  if (trimmedAddress) {
    sheet.getRange(newRow, OBJ_COL.ADDRESS).setValue(trimmedAddress);
    // Геокодируем прямо здесь (синхронно) — админ в приложении сразу
    // увидит результат (распознанный адрес или причину сбоя), не дожидаясь
    // отдельного запуска из меню таблицы.
    geocodeObjectRow_(sheet, newRow);
  }

  // Сразу же переносим новый объект финдиру (и заодно подтягиваем от неё
  // всё, что у нас ещё не появилось) — чтобы не ждать до 10 минут
  // (см. syncObjectsWithFindir_). Сбой здесь (например, её таблица
  // недоступна) не должен мешать самому добавлению объекта — он уже
  // сохранён у нас, просто синхронизация попробует снова по расписанию.
  syncObjectsWithFindirSafe_();

  return adminGetObjects(adminPhone);
}

// Обновляет расписание смен и ответственного прораба уже существующего
// объекта (по названию). Адрес и геокодирование этим действием не
// затрагиваются — для смены адреса по-прежнему используется сам список
// (повторный ввод адреса) или таблица.
function adminUpdateObjectShifts(adminPhone, objectName, shift1Start, shift1End, shift2Start, shift2End, foremanPhone) {
  var auth = adminAuth_(adminPhone);
  if (!auth.ok) return { status: 'error', message: auth.error };

  var trimmedName = String(objectName || '').trim();
  if (!trimmedName) return { status: 'error', message: 'Не указан объект' };

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты');
  if (!sheet || sheet.getLastRow() < 2) {
    return { status: 'error', message: 'Объект не найден' };
  }
  ensureObjectGeoColumns_(sheet);

  var names = sheet.getRange(2, OBJ_COL.NAME, sheet.getLastRow() - 1, 1).getValues();
  var row = -1;
  for (var i = 0; i < names.length; i++) {
    if (String(names[i][0]).trim() === trimmedName) {
      row = i + 2;
      break;
    }
  }
  if (row === -1) return { status: 'error', message: 'Объект с таким названием не найден' };

  var written = writeObjectShiftsAndForeman_(sheet, row, shift1Start, shift1End, shift2Start, shift2End, foremanPhone);
  if (!written.ok) return { status: 'error', message: written.error };

  return adminGetObjects(adminPhone);
}

// ===== Задачи (разовые поручения) =====
// Отдельно от обычных смен: админ ставит конкретному сотруднику разовую
// задачу на объекте (текст + опционально фото), сотрудник проходит путь
// Актуальна -> В работе (фото "до") -> Выполнена (фото "после" +
// комментарий). Лист создаётся автоматически.
var TASKS_SHEET_COLUMNS = [
  'ID', 'Телефон', 'ФИО', 'Объект', 'Текст', 'ФотоЗадачи', 'Статус',
  'Создано', 'ФотоДо', 'Начато', 'ФотоПосле', 'Комментарий', 'Выполнено'
];
var TASK_COL = {
  ID: 1, PHONE: 2, NAME: 3, OBJECT: 4, TEXT: 5, PHOTOS_TASK: 6, STATUS: 7,
  CREATED: 8, PHOTOS_BEFORE: 9, STARTED: 10, PHOTOS_AFTER: 11, COMMENT: 12, COMPLETED: 13
};
var TASK_STATUS = { NEW: 'Актуальна', IN_PROGRESS: 'В работе', DONE: 'Выполнена' };

// Если номер телефона начинается с "+" (или вообще похож на выражение),
// Google Таблицы по умолчанию могут попытаться прочитать значение ячейки
// как формулу — и это иногда приводит к #ERROR! вместо самого номера
// (именно это и произошло с колонкой "Телефон"). Принудительно делаем
// столбец текстовым ДО записи в него — тогда число/номер в нём никогда
// не пытается вычислиться как формула.
function ensureTextColumn_(sheet, colIndex) {
  var numRows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, colIndex, numRows, 1).setNumberFormat('@');
}

function getOrCreateTasksSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Задачи');
  if (!sheet) {
    sheet = ss.insertSheet('Задачи');
    sheet.getRange(1, 1, 1, TASKS_SHEET_COLUMNS.length).setValues([TASKS_SHEET_COLUMNS]);
  }
  ensureTextColumn_(sheet, 2); // колонка B — "Телефон"
  return sheet;
}

// Строку URL'ов (через запятую) превращает обратно в массив для фронтенда.
function urlsToArray_(cellValue) {
  var str = String(cellValue || '').trim();
  if (!str) return [];
  return str.split(',').map(function (s) { return s.trim(); }).filter(String);
}

function adminCreateTask(adminPhone, targetPhone, name, objectName, text, photosBase64) {
  var auth = adminAuth_(adminPhone);
  if (!auth.ok) return { status: 'error', message: auth.error };

  var phone = normalizePhone_(targetPhone);
  if (!phone) {
    return { status: 'error', message: 'Не выбран исполнитель' };
  }
  var employee = findEmployeeByPhone(phone);
  if (!employee) {
    return { status: 'error', message: 'Сотрудник с таким номером не найден' };
  }

  var trimmedObject = String(objectName || '').trim();
  if (!trimmedObject) {
    return { status: 'error', message: 'Выберите объект' };
  }
  if (getValidObjects().indexOf(trimmedObject) === -1) {
    return { status: 'error', message: 'Такого объекта нет в списке — выберите из подсказки' };
  }

  var taskText = String(text || '').trim();
  if (!taskText) {
    return { status: 'error', message: 'Введите текст задачи' };
  }

  var photoUrls = savePhotos_(photosBase64, employee.name + '_задача', 'Фото задач');

  var sheet = getOrCreateTasksSheet_();
  var id = Utilities.getUuid();
  var row = [];
  row[TASK_COL.ID - 1] = id;
  row[TASK_COL.PHONE - 1] = phone;
  row[TASK_COL.NAME - 1] = employee.name;
  row[TASK_COL.OBJECT - 1] = trimmedObject;
  row[TASK_COL.TEXT - 1] = taskText;
  row[TASK_COL.PHOTOS_TASK - 1] = photoUrls.join(', ');
  row[TASK_COL.STATUS - 1] = TASK_STATUS.NEW;
  row[TASK_COL.CREATED - 1] = new Date();
  row[TASK_COL.PHOTOS_BEFORE - 1] = '';
  row[TASK_COL.STARTED - 1] = '';
  row[TASK_COL.PHOTOS_AFTER - 1] = '';
  row[TASK_COL.COMMENT - 1] = '';
  row[TASK_COL.COMPLETED - 1] = '';
  sheet.appendRow(row);

  return { status: 'ok', id: id };
}

function taskRowToObject_(row) {
  return {
    id: row[TASK_COL.ID - 1],
    phone: normalizePhone_(row[TASK_COL.PHONE - 1]),
    name: row[TASK_COL.NAME - 1],
    objectName: row[TASK_COL.OBJECT - 1] || '',
    text: row[TASK_COL.TEXT - 1],
    taskPhotos: urlsToArray_(row[TASK_COL.PHOTOS_TASK - 1]),
    status: row[TASK_COL.STATUS - 1],
    createdAt: row[TASK_COL.CREATED - 1] ? Utilities.formatDate(new Date(row[TASK_COL.CREATED - 1]), 'Europe/Moscow', 'dd.MM.yyyy HH:mm') : '',
    beforePhotos: urlsToArray_(row[TASK_COL.PHOTOS_BEFORE - 1]),
    startedAt: row[TASK_COL.STARTED - 1] ? Utilities.formatDate(new Date(row[TASK_COL.STARTED - 1]), 'Europe/Moscow', 'dd.MM.yyyy HH:mm') : '',
    afterPhotos: urlsToArray_(row[TASK_COL.PHOTOS_AFTER - 1]),
    comment: row[TASK_COL.COMMENT - 1] || '',
    completedAt: row[TASK_COL.COMPLETED - 1] ? Utilities.formatDate(new Date(row[TASK_COL.COMPLETED - 1]), 'Europe/Moscow', 'dd.MM.yyyy HH:mm') : ''
  };
}

// Все задачи (всех статусов, новые сверху) — для обзора у админа, с полным
// набором полей, чтобы по клику на карточку сразу показать результат без
// отдельного запроса.
function adminGetTasks(phone) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };

  var sheet = getOrCreateTasksSheet_();
  if (sheet.getLastRow() < 2) return { status: 'ok', tasks: [] };

  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, TASKS_SHEET_COLUMNS.length).getValues();
  var tasks = data.map(taskRowToObject_).reverse();

  return { status: 'ok', tasks: tasks };
}

// Незавершённые задачи конкретного сотрудника (и новые, и уже взятые в
// работу — чтобы можно было продолжить) — не требует прав администратора,
// только номер телефона, как getMyStats/getShiftStatus.
function getMyTasks(phone) {
  var sheet = getOrCreateTasksSheet_();
  if (sheet.getLastRow() < 2) return { status: 'ok', tasks: [] };

  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, TASKS_SHEET_COLUMNS.length).getValues();
  var normalizedPhone = normalizePhone_(phone);
  var tasks = data
    .filter(function (row) {
      return normalizePhone_(row[TASK_COL.PHONE - 1]) === normalizedPhone &&
        row[TASK_COL.STATUS - 1] !== TASK_STATUS.DONE;
    })
    .map(taskRowToObject_)
    .reverse();

  return { status: 'ok', tasks: tasks };
}

// Одна задача по id — для экрана деталей у сотрудника (после отправки
// фото "до"/"после" экран сам перечитывает актуальное состояние).
function getTaskById(phone, taskId) {
  var sheet = getOrCreateTasksSheet_();
  if (sheet.getLastRow() < 2) return { status: 'error', message: 'Задача не найдена' };
  var normalizedPhone = normalizePhone_(phone);
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, TASKS_SHEET_COLUMNS.length).getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][TASK_COL.ID - 1]) === String(taskId)) {
      if (normalizePhone_(data[i][TASK_COL.PHONE - 1]) !== normalizedPhone) {
        return { status: 'error', message: 'Эта задача поставлена не вам' };
      }
      return { status: 'ok', task: taskRowToObject_(data[i]) };
    }
  }
  return { status: 'error', message: 'Задача не найдена' };
}

// Сотрудник нажал "Приступить к выполнению" и приложил фото "до" —
// переводит задачу в статус "В работе". Можно сделать только из
// "Актуальна" (повторное нажатие или устаревший экран ничего не испортят).
function startTask(phone, taskId, beforePhotosBase64) {
  var sheet = getOrCreateTasksSheet_();
  if (sheet.getLastRow() < 2) return { status: 'error', message: 'Задача не найдена' };
  var normalizedPhone = normalizePhone_(phone);
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, TASKS_SHEET_COLUMNS.length).getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][TASK_COL.ID - 1]) === String(taskId)) {
      if (normalizePhone_(data[i][TASK_COL.PHONE - 1]) !== normalizedPhone) {
        return { status: 'error', message: 'Эта задача поставлена не вам' };
      }
      var currentStatus = data[i][TASK_COL.STATUS - 1];
      if (currentStatus === TASK_STATUS.DONE) {
        return { status: 'error', message: 'Задача уже отмечена выполненной' };
      }
      if (currentStatus === TASK_STATUS.IN_PROGRESS) {
        return { status: 'ok' }; // уже начата — ничего не делаем, не ошибка
      }
      var photoUrls = savePhotos_(beforePhotosBase64, data[i][TASK_COL.NAME - 1] + '_до', 'Фото задач');
      var rowNum = i + 2;
      sheet.getRange(rowNum, TASK_COL.STATUS).setValue(TASK_STATUS.IN_PROGRESS);
      sheet.getRange(rowNum, TASK_COL.PHOTOS_BEFORE).setValue(photoUrls.join(', '));
      sheet.getRange(rowNum, TASK_COL.STARTED).setValue(new Date());
      return { status: 'ok' };
    }
  }
  return { status: 'error', message: 'Задача не найдена' };
}

// Сотрудник подтверждает выполнение — фото "после" (можно несколько) и
// необязательный комментарий (например, про доп. работы).
function completeTask(phone, taskId, afterPhotosBase64, comment) {
  var sheet = getOrCreateTasksSheet_();
  if (sheet.getLastRow() < 2) {
    return { status: 'error', message: 'Задача не найдена' };
  }
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, TASKS_SHEET_COLUMNS.length).getValues();
  var normalizedPhone = normalizePhone_(phone);
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][TASK_COL.ID - 1]) === String(taskId)) {
      // Задачу может закрыть только тот, кому она поставлена — иначе
      // достаточно было бы знать (или подобрать) id чужой задачи.
      if (normalizePhone_(data[i][TASK_COL.PHONE - 1]) !== normalizedPhone) {
        return { status: 'error', message: 'Эта задача поставлена не вам' };
      }
      if (data[i][TASK_COL.STATUS - 1] === TASK_STATUS.DONE) {
        return { status: 'ok' }; // уже выполнена — ничего не делаем, не ошибка
      }
      var photoUrls = savePhotos_(afterPhotosBase64, data[i][TASK_COL.NAME - 1] + '_после', 'Фото задач');
      var rowNum = i + 2;
      sheet.getRange(rowNum, TASK_COL.STATUS).setValue(TASK_STATUS.DONE);
      sheet.getRange(rowNum, TASK_COL.PHOTOS_AFTER).setValue(photoUrls.join(', '));
      sheet.getRange(rowNum, TASK_COL.COMMENT).setValue(String(comment || '').trim());
      sheet.getRange(rowNum, TASK_COL.COMPLETED).setValue(new Date());
      return { status: 'ok' };
    }
  }
  return { status: 'error', message: 'Задача не найдена' };
}

function registerUser(name, phone, photoBase64, googleIdToken) {
  // Нормализуем сразу на входе — дальше everywhere в этой функции
  // используется уже чистый, только-цифровой номер: это и предотвращает
  // ошибку формулы в Таблицах при записи, и гарантирует, что при входе
  // позже (loginUser) номер найдётся, даже если был введён с другим
  // форматированием (пробелы, скобки и т.п. дают один и тот же результат).
  phone = normalizePhone_(phone);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');

  // Быстрая предварительная проверка без блокировки — если номер уже
  // точно есть, незачем ждать лок и заново гонять проверку токена.
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (normalizePhone_(data[i][1]) === phone) {
      return { status: 'ok', name: data[i][0], phone: phone, alreadyRegistered: true };
    }
  }

  // Подтверждение личности через Google обязательно для НОВОЙ регистрации
  // (уже известные номера логинятся через loginUser() и в этой проверке
  // не нуждаются — см. ветку alreadyRegistered выше).
  var googleEmail = verifyGoogleIdToken_(googleIdToken);
  if (!googleEmail) {
    return {
      status: 'error',
      message: 'Не удалось подтвердить вход через Google. Попробуйте войти через Google ещё раз.'
    };
  }
  var normalizedEmail = String(googleEmail).trim().toLowerCase();

  var photoUrl = '';
  if (photoBase64) {
    try {
      photoUrl = savePhoto(photoBase64, name);
    } catch (e) {
      photoUrl = 'Ошибка сохранения фото: ' + e;
    }
  }

  // Блокировка на время повторной проверки + записи строки. Без неё две
  // почти одновременные регистрации (двойной тап, быстрый повторный
  // тест и т.п.) могут обе успеть прочитать таблицу ДО того, как первая
  // из них запишет свою строку — тогда обе пройдут проверку на дубль
  // номера/email и обе будут добавлены. Apps Script выполняется медленно
  // (иногда 10-30 секунд), поэтому такое окно гонки вполне реально.
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    // Перечитываем таблицу заново — за время проверки токена и загрузки
    // фото кто-то другой мог уже успеть зарегистрироваться.
    data = sheet.getDataRange().getValues();

    for (var i2 = 1; i2 < data.length; i2++) {
      if (normalizePhone_(data[i2][1]) === phone) {
        return { status: 'ok', name: data[i2][0], phone: phone, alreadyRegistered: true };
      }
    }

    // Один Google-аккаунт — один номер телефона. Не даём зарегистрировать
    // ВТОРОЙ (новый) номер на email, который уже привязан к другому,
    // существующему сотруднику — иначе один и тот же человек мог бы иметь
    // несколько "личностей" в табеле под разными телефонами.
    for (var j = 1; j < data.length; j++) {
      var existingEmail = String(data[j][5] || '').trim().toLowerCase();
      if (existingEmail && existingEmail === normalizedEmail) {
        return {
          status: 'error',
          message: 'Этот Google-аккаунт (' + googleEmail + ') уже привязан к другому номеру телефона (' +
            data[j][1] + ', ' + data[j][0] + '). Один аккаунт Google можно привязать только к одному номеру. ' +
            'Если это ваш прежний номер — войдите через экран «Вход», указав именно тот номер.'
        };
      }
    }

    sheet.appendRow([name, phone, new Date(), photoUrl]);
    var newRow = sheet.getLastRow();
    sheet.getRange(newRow, 2).setNumberFormat('@').setValue(String(phone));
    // Колонка F — email, подтверждённый через Google при регистрации.
    // Колонка E ("Ставка") специально не трогаем — админ заполняет её сам.
    sheet.getRange(newRow, 6).setValue(googleEmail);
  } finally {
    lock.releaseLock();
  }

  return { status: 'ok', name: name, phone: phone, alreadyRegistered: false };
}

// Вход по номеру телефона для уже зарегистрированных сотрудников —
// в отличие от registerUser(), не создаёт новую запись и не требует
// фото/согласия, только проверяет, что такой номер уже есть в "Сотрудники".
function loginUser(phone) {
  phone = normalizePhone_(phone);
  var employee = findEmployeeByPhone(phone);
  if (!employee) {
    return {
      status: 'error',
      message: 'Номер не найден.'
    };
  }
  return { status: 'ok', name: employee.name, phone: phone };
}

function savePhoto(base64Data, name, folderName) {
  folderName = folderName || 'Фото сотрудников';
  var folders = DriveApp.getFoldersByName(folderName);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

  var commaIdx = base64Data.indexOf(',');
  var pureBase64 = commaIdx >= 0 ? base64Data.substring(commaIdx + 1) : base64Data;
  var bytes = Utilities.base64Decode(pureBase64);

  var safeName = String(name).replace(/[^a-zA-Zа-яА-ЯёЁ0-9]+/g, '_');
  var fileName = safeName + '_' + new Date().getTime() + '.jpg';
  var blob = Utilities.newBlob(bytes, 'image/jpeg', fileName);

  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

// Сохраняет НЕСКОЛЬКО фото разом (для задач — фото самой задачи, "до" и
// "после" могут быть не одной штукой). photosBase64 — массив строк
// data:image/...;base64,.... Ошибка на одной фотографии не отменяет
// остальные — просто эта конкретная пропускается. Возвращает массив URL
// (через запятую удобно хранить в одной ячейке листа).
function savePhotos_(photosBase64, namePrefix, folderName) {
  var urls = [];
  if (!photosBase64 || !photosBase64.length) return urls;
  for (var i = 0; i < photosBase64.length; i++) {
    try {
      urls.push(savePhoto(photosBase64[i], namePrefix + '_' + (i + 1), folderName));
    } catch (e) {
      // одно "сломанное" фото не должно обрушивать сохранение остальных
    }
  }
  return urls;
}

// --- Быстрое хранилище "кто сейчас на смене" ---
// Раньше открытая смена определялась чтением ВСЕГО листа "Учет" и поиском
// последней записи нужного телефона — чем больше строк накапливалось в
// "Учет", тем дольше это выполнялось (это и была причина задержки
// 13-20 секунд между сканированием QR-кода и появлением кнопки).
// Теперь текущее состояние (кто на смене и на каком объекте) хранится
// отдельно, в PropertiesService — это как отдельная маленькая табличка
// внутри самого скрипта, которая читается и пишется мгновенно, независимо
// от того, сколько строк накопилось в "Учет" за всё время.
var OPEN_SHIFTS_PROP_KEY = 'openShifts_v1';

function getOpenShiftsMap_() {
  var raw = PropertiesService.getScriptProperties().getProperty(OPEN_SHIFTS_PROP_KEY);
  if (raw === null) {
    // Карта ещё ни разу не строилась (например, сразу после обновления на
    // эту версию) — один-единственный раз собираем её по всей истории
    // "Учет", дальше это уже не потребуется.
    return migrateOpenShiftsFromLog();
  }
  try {
    var parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return migrateOpenShiftsFromLog();
  }
}

function saveOpenShiftsMap_(map) {
  PropertiesService.getScriptProperties().setProperty(OPEN_SHIFTS_PROP_KEY, JSON.stringify(map));
}

// Разовая (само)миграция: строит карту открытых смен по всей истории
// "Учет" — так же, как раньше вычислялось на лету. Нужна только один раз;
// дальше карта обновляется по одной записи при каждой отметке.
function migrateOpenShiftsFromLog() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Учет');
  var map = {};
  if (sheet && sheet.getLastRow() >= 2) {
    var lastRow = sheet.getLastRow();
    var data = sheet.getRange(2, 1, lastRow - 1, 5).getValues(); // Дата и время, ФИО, Телефон, Объект, Тип события
    for (var i = 0; i < data.length; i++) {
      var phone = normalizePhone_(data[i][2]);
      var objectName = String(data[i][3]).trim();
      var eventType = data[i][4];
      if (!phone) continue;
      if (eventType === 'Приход') {
        map[phone] = { objectName: objectName };
      } else if (eventType === 'Уход') {
        delete map[phone];
      }
    }
  }
  saveOpenShiftsMap_(map);
  return map;
}

// Определяет, открыта ли сейчас смена у сотрудника, и если да — на каком
// объекте. Возвращает { open: true/false, objectName: "..." или null }
function getOpenShift(phone) {
  var map = getOpenShiftsMap_();
  var trimmedPhone = normalizePhone_(phone);
  var entry = map[trimmedPhone];
  if (entry && entry.objectName) {
    return { open: true, objectName: entry.objectName };
  }
  return { open: false, objectName: null };
}

function logEvent(name, phone, objectName, eventType, geo) {
  phone = normalizePhone_(phone);
  var validObjects = getValidObjects();
  var trimmedObject = String(objectName).trim();

  if (validObjects.indexOf(trimmedObject) === -1) {
    return {
      status: 'error',
      message: 'Этот QR-код не относится ни к одному известному объекту'
    };
  }

  if (eventType !== 'Приход' && eventType !== 'Уход') {
    return { status: 'error', message: 'Неизвестный тип события' };
  }

  // GPS-проверка: если для объекта известны координаты (администратор
  // указал адрес в листе "Объекты", и он успешно геокодирован), сверяем их
  // с координатами телефона в момент отметки. Если координат объекта ещё
  // нет — проверку просто пропускаем (не блокируем отметки там, где адрес
  // не заполнен). Цель — не поймать человека в 20 метрах от входа, а отсечь
  // явную подделку (отметка за много километров от объекта).
  var objCoords = getObjectCoords_(trimmedObject);
  var geoDistance = '';
  if (objCoords) {
    var hasGeo = geo && typeof geo.lat === 'number' && typeof geo.lng === 'number';
    if (!hasGeo) {
      return {
        status: 'error',
        reason: 'geo_required',
        message: 'Не удалось определить ваше местоположение. Разрешите доступ к геолокации в браузере и попробуйте ещё раз.'
      };
    }
    var distance = haversineMeters_(geo.lat, geo.lng, objCoords.lat, objCoords.lng);
    geoDistance = Math.round(distance);
    if (distance > GEO_RADIUS_METERS) {
      logGeoBlockedAttempt_(name, phone, trimmedObject, eventType, geo, geoDistance);
      return {
        status: 'error',
        reason: 'geo_blocked',
        distance: geoDistance,
        message: 'Вы находитесь примерно в ' + formatDistanceMeters_(geoDistance) + ' от объекта «' + trimmedObject +
          '» — это слишком далеко. Отметка засчитывается только непосредственно на объекте. Попытка зафиксирована.'
      };
    }
  }

  // Защита от задвоения приходов/уходов и от "входа" на второй объект без
  // "выхода" с первого. Проверяется по серверным данным (карта открытых
  // смен), а не только по состоянию кнопок во фронтенде, чтобы это нельзя
  // было обойти обновлением страницы, вторым устройством и т.п.
  //
  // Всё это (проверка + запись + обновление карты) выполняется под
  // блокировкой (LockService), чтобы две почти одновременные отметки не
  // могли одна другую "перезаписать" и испортить карту открытых смен.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    return { status: 'error', message: 'Сервер сейчас занят, попробуйте отметиться ещё раз через пару секунд.' };
  }

  try {
    var openShift = getOpenShift(phone);

    if (eventType === 'Приход') {
      if (openShift.open) {
        if (openShift.objectName === trimmedObject) {
          return {
            status: 'error',
            message: 'Вы уже отметили приход на этом объекте. Сначала отметьте уход, прежде чем отмечать приход снова.'
          };
        }
        return {
          status: 'error',
          message: 'Вы ещё не закончили работу на объекте «' + openShift.objectName + '». ' +
            'Сначала отметьте там уход — потом можно будет отметить приход на другом объекте.'
        };
      }
    } else { // 'Уход'
      if (!openShift.open) {
        return {
          status: 'error',
          message: 'Вы ещё не отметили приход. Сначала отметьте приход, прежде чем отмечать уход.'
        };
      }
      if (openShift.objectName !== trimmedObject) {
        return {
          status: 'error',
          message: 'Ваша смена открыта на объекте «' + openShift.objectName + '». ' +
            'Отметить уход нужно там же — на этом объекте у вас нет открытой смены.'
        };
      }
    }

    var now = new Date();
    var lateMinutes = '';

    if (eventType === 'Приход') {
      var shiftsByObject = getObjectShifts();
      var shifts = shiftsByObject[trimmedObject];
      var nearest = findNearestShift(now, shifts);
      if (nearest) {
        lateMinutes = nearest.lateMinutes;
      }
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Учет');
    sheet.appendRow([
      now, name, phone, objectName, eventType, lateMinutes,
      geo && typeof geo.lat === 'number' ? geo.lat : '',
      geo && typeof geo.lng === 'number' ? geo.lng : '',
      geoDistance
    ]);
    var newRow = sheet.getLastRow();
    sheet.getRange(newRow, 3).setNumberFormat('@').setValue(String(phone));

    // Обновляем карту открытых смен — именно она (а не весь "Учет")
    // теперь используется для мгновенной проверки статуса.
    var map = getOpenShiftsMap_();
    var trimmedPhone = String(phone).trim();
    if (eventType === 'Приход') {
      map[trimmedPhone] = { objectName: trimmedObject };
    } else {
      delete map[trimmedPhone];
    }
    saveOpenShiftsMap_(map);

    // updateAnalytics() здесь больше НЕ вызывается — раньше он пересчитывал
    // целиком весь лист "Аналитика" при каждой отметке, и чем больше
    // накапливалось строк в "Учет", тем дольше сотрудник ждал ответа после
    // нажатия кнопки. Личный кабинет (getMyStats) в "Аналитике" не
    // нуждается — он считает статистику сам, напрямую по листу "Учет".
    // Лист "Аналитика" обновляется по времени (см. setupAnalyticsTrigger)
    // либо вручную через меню "Учёт времени -> Обновить аналитику".

    return {
      status: 'ok',
      name: name,
      objectName: objectName,
      eventType: eventType,
      time: Utilities.formatDate(now, 'Europe/Moscow', 'dd.MM.yyyy HH:mm:ss'),
      lateMinutes: lateMinutes
    };
  } finally {
    lock.releaseLock();
  }
}

// Пересчитывает отработанные часы (в формате Ч:ММ), сумму к оплате по ставке
// и опоздание в минутах (по колонке F листа "Учет")
function updateAnalytics() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = ss.getSheetByName('Учет');
  if (!logSheet || logSheet.getLastRow() < 2) return;

  var lastCol = Math.max(logSheet.getLastColumn(), 6);
  var data = logSheet.getRange(2, 1, logSheet.getLastRow() - 1, lastCol).getValues();
  var rates = getEmployeeRates();

  var shifts = {};
  for (var i = 0; i < data.length; i++) {
    var ts = data[i][0];
    var name = data[i][1];
    var eventType = data[i][4];
    var lateVal = data[i][5];
    if (!(ts instanceof Date) || !name || !eventType) continue;

    var dateStr = Utilities.formatDate(ts, 'Europe/Moscow', 'dd.MM.yyyy');
    var key = name + '|' + dateStr;
    if (!shifts[key]) {
      shifts[key] = { name: name, date: dateStr, arrival: null, departure: null, lateMinutes: '' };
    }
    if (eventType === 'Приход') {
      if (!shifts[key].arrival || ts < shifts[key].arrival) {
        shifts[key].arrival = ts;
        shifts[key].lateMinutes = (lateVal === '' || lateVal === null || lateVal === undefined) ? '' : Number(lateVal);
      }
    } else if (eventType === 'Уход') {
      if (!shifts[key].departure || ts > shifts[key].departure) shifts[key].departure = ts;
    }
  }

  var keys = Object.keys(shifts);
  keys.sort(function (a, b) {
    var sa = shifts[a], sb = shifts[b];
    var da = sa.date.split('.').reverse().join('-');
    var db = sb.date.split('.').reverse().join('-');
    if (da !== db) return da < db ? -1 : 1;
    return sa.name.localeCompare(sb.name, 'ru');
  });

  var rows = [];       // [ФИО, Дата, Приход, Уход, ЧасовДолей, ОплатаЗаДень, Опоздание(мин)]
  var totalHours = {}; // name -> сумма долей суток
  var totalPay = {};   // name -> сумма оплаты
  var totalLate = {};  // name -> сумма опозданий (мин), только положительные

  keys.forEach(function (key) {
    var s = shifts[key];
    var hoursFraction = '';
    var payForDay = '';

    if (s.arrival && s.departure && s.departure > s.arrival) {
      var ms = s.departure - s.arrival;
      hoursFraction = ms / 86400000;
      var decimalHours = ms / 3600000;
      var rate = rates[s.name] || 0;
      payForDay = Math.round((decimalHours / 8) * rate * 100) / 100;

      totalHours[s.name] = (totalHours[s.name] || 0) + hoursFraction;
      totalPay[s.name] = (totalPay[s.name] || 0) + payForDay;
    }

    if (typeof s.lateMinutes === 'number' && s.lateMinutes > 0) {
      totalLate[s.name] = (totalLate[s.name] || 0) + s.lateMinutes;
    }

    rows.push([
      s.name,
      s.date,
      s.arrival ? Utilities.formatDate(s.arrival, 'Europe/Moscow', 'HH:mm') : '',
      s.departure ? Utilities.formatDate(s.departure, 'Europe/Moscow', 'HH:mm') : '',
      hoursFraction,
      payForDay,
      s.lateMinutes
    ]);
  });

  var sheet = ss.getSheetByName('Аналитика');
  if (!sheet) sheet = ss.insertSheet('Аналитика');
  sheet.clearContents();
  sheet.clearFormats();

  var headers = ['ФИО', 'Дата', 'Приход', 'Уход', 'Часов отработано', 'Оплата за день', 'Опоздание (мин)'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 7).setValues(rows);
    sheet.getRange(2, 5, rows.length, 1).setNumberFormat('[h]:mm');
    sheet.getRange(2, 6, rows.length, 1).setNumberFormat('#,##0.00');
  }

  var totalNames = Object.keys(totalHours).sort(function (a, b) { return a.localeCompare(b, 'ru'); });
  var totalHeaders = ['ФИО', 'Итого часов', 'Итого к оплате', 'Итого опозданий (мин)'];
  sheet.getRange(1, 9, 1, totalHeaders.length).setValues([totalHeaders]).setFontWeight('bold');

  var totalRows = totalNames.map(function (n) {
    return [n, totalHours[n], Math.round((totalPay[n] || 0) * 100) / 100, totalLate[n] || 0];
  });
  if (totalRows.length > 0) {
    sheet.getRange(2, 9, totalRows.length, 4).setValues(totalRows);
    sheet.getRange(2, 10, totalRows.length, 1).setNumberFormat('[h]:mm');
    sheet.getRange(2, 11, totalRows.length, 1).setNumberFormat('#,##0.00');
  }
}

// Переводит долю суток (например 0.354166) в строку "Ч:ММ" (например "8:30")
function hoursFractionToStr(fraction) {
  var totalMinutes = Math.round(fraction * 24 * 60);
  var h = Math.floor(totalMinutes / 60);
  var m = totalMinutes % 60;
  return h + ':' + (m < 10 ? '0' + m : m);
}

// Находит сотрудника по номеру телефона в листе "Сотрудники". Сравнение —
// по нормализованным (только цифры) номерам, поэтому находит сотрудника,
// даже если в самой таблице его номер ещё хранится "по старому", с
// пробелами/скобками/дефисами (так было до исправления normalizePhone_).
function findEmployeeByPhone(phone) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
  if (!sheet || sheet.getLastRow() < 2) return null;
  var normalizedPhone = normalizePhone_(phone);
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  for (var i = 0; i < data.length; i++) {
    if (normalizePhone_(data[i][1]) === normalizedPhone) {
      return { name: data[i][0], rate: Number(data[i][4]) || 0 };
    }
  }
  return null;
}

// Определяет, открыта ли сейчас смена у сотрудника: смотрит на его последнюю по времени
// отметку в листе "Учет" — если это был "Приход", значит смена ещё не закрыта "Уходом".
// Используется, чтобы во фронтенде отключать кнопку "Отметить уход", пока смена не начата,
// и наоборот — "Отметить приход", если смена уже идёт.
function getShiftStatus(phone) {
  var openShift = getOpenShift(phone);
  return { status: 'ok', shiftOpen: openShift.open, openObjectName: openShift.objectName };
}

// v33: к статистике кабинета добавляются отгулы/больничные со статусом
function getMyStats(phone) {
  var res = getMyStatsCore_(phone);
  if (res.status !== 'ok') return res;
  var y = new Date().getFullYear();
  var list = [];
  [y, y - 1].forEach(function (yr) {
    var a = getMyAbsences(phone, yr);
    if (a && a.status === 'ok') list = list.concat(a.items);
  });
  list.sort(function (a, b) { return a.dateFrom < b.dateFrom ? 1 : (a.dateFrom > b.dateFrom ? -1 : 0); });
  res.absences = list.slice(0, 30);
  return res;
}

// Собирает статистику для личного кабинета конкретного сотрудника (по телефону)
function getMyStatsCore_(phone) {
  var employee = findEmployeeByPhone(phone);
  if (!employee) {
    return { status: 'error', message: 'Сотрудник не найден' };
  }
  var name = employee.name;
  var rate = employee.rate;

  var logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Учет');
  if (!logSheet || logSheet.getLastRow() < 2) {
    return {
      status: 'ok', name: name,
      totalHours: '0:00', totalPay: 0, totalLateMinutes: 0,
      monthHours: '0:00', monthPay: 0, monthLateMinutes: 0,
      days: []
    };
  }

  var lastCol = Math.max(logSheet.getLastColumn(), 6);
  var data = logSheet.getRange(2, 1, logSheet.getLastRow() - 1, lastCol).getValues();
  var shifts = {};
  for (var i = 0; i < data.length; i++) {
    var ts = data[i][0];
    var rowName = data[i][1];
    var eventType = data[i][4];
    var lateVal = data[i][5];
    if (!(ts instanceof Date) || rowName !== name || !eventType) continue;

    var dateStr = Utilities.formatDate(ts, 'Europe/Moscow', 'dd.MM.yyyy');
    if (!shifts[dateStr]) {
      shifts[dateStr] = { date: dateStr, arrival: null, departure: null, lateMinutes: '' };
    }
    if (eventType === 'Приход') {
      if (!shifts[dateStr].arrival || ts < shifts[dateStr].arrival) {
        shifts[dateStr].arrival = ts;
        shifts[dateStr].lateMinutes = (lateVal === '' || lateVal === null || lateVal === undefined) ? '' : Number(lateVal);
      }
    } else if (eventType === 'Уход') {
      if (!shifts[dateStr].departure || ts > shifts[dateStr].departure) shifts[dateStr].departure = ts;
    }
  }

  var dateKeys = Object.keys(shifts);
  dateKeys.sort(function (a, b) {
    var da = a.split('.').reverse().join('-');
    var db = b.split('.').reverse().join('-');
    return da < db ? 1 : -1; // по убыванию — сначала свежие
  });

  var nowMonthKey = Utilities.formatDate(new Date(), 'Europe/Moscow', 'MM.yyyy');

  var totalFraction = 0, totalPay = 0, totalLateMinutes = 0;
  var monthFraction = 0, monthPay = 0, monthLateMinutes = 0;
  var days = [];

  dateKeys.forEach(function (dateStr) {
    var s = shifts[dateStr];
    var hoursStr = '', payForDay = 0, fraction = 0;
    var lateMinutes = (typeof s.lateMinutes === 'number') ? s.lateMinutes : null;

    if (s.arrival && s.departure && s.departure > s.arrival) {
      var ms = s.departure - s.arrival;
      fraction = ms / 86400000;
      var decimalHours = ms / 3600000;
      payForDay = Math.round((decimalHours / 8) * rate * 100) / 100;
      hoursStr = hoursFractionToStr(fraction);

      totalFraction += fraction;
      totalPay += payForDay;

      var partsDMY = dateStr.split('.'); // dd.mm.yyyy
      var monthKey = partsDMY[1] + '.' + partsDMY[2];
      if (monthKey === nowMonthKey) {
        monthFraction += fraction;
        monthPay += payForDay;
      }
    }

    if (lateMinutes !== null) {
      var partsDMY2 = dateStr.split('.');
      var monthKey2 = partsDMY2[1] + '.' + partsDMY2[2];
      if (lateMinutes > 0) {
        totalLateMinutes += lateMinutes;
        if (monthKey2 === nowMonthKey) monthLateMinutes += lateMinutes;
      }
    }

    days.push({
      date: dateStr,
      arrival: s.arrival ? Utilities.formatDate(s.arrival, 'Europe/Moscow', 'HH:mm') : '',
      departure: s.departure ? Utilities.formatDate(s.departure, 'Europe/Moscow', 'HH:mm') : '',
      hours: hoursStr,
      pay: payForDay,
      lateMinutes: lateMinutes // null - нет данных (например старая запись до внедрения смен), 0 - вовремя/раньше, >0 - опоздание в минутах
    });
  });

  return {
    status: 'ok',
    name: name,
    rate: rate,
    totalHours: hoursFractionToStr(totalFraction),
    totalPay: Math.round(totalPay * 100) / 100,
    totalLateMinutes: totalLateMinutes,
    monthHours: hoursFractionToStr(monthFraction),
    monthPay: Math.round(monthPay * 100) / 100,
    monthLateMinutes: monthLateMinutes,
    days: days.slice(0, 30) // последние 30 смен, чтобы не перегружать экран
  };
}


// ======================= ОТСУТСТВИЯ (отгулы / больничные) =======================
// Лист "Отсутствия" создаётся автоматически при первой заявке. Типы:
//   leave — Отгул (диапазон дат, рабочие дни пн–пт × 8 ч)
//   sick  — Больничный (так же, но считается отдельно от отгулов)
//   late  — Приду позже (одна дата, время отсутствия с–по)
//   early — Уйду раньше (одна дата, время отсутствия с–по)
var ABSENCE_SHEET_NAME = 'Отсутствия';
var WORKDAY_HOURS = 8;
// Рабочий день офиса для расчёта "приду позже / уйду раньше": человек
// указывает одно время, а недостающие часы считаются от начала/до конца
// дня. Обеденный перерыв НЕ вычитается; при необходимости поменяйте тут.
var OFFICE_START = '09:00';
var OFFICE_END = '18:00';
var ABSENCE_HEADERS = [
  'Дата заявки', 'ФИО', 'Телефон', 'Тип', 'С даты', 'По дату',
  'Время с', 'Время по', 'Часов', 'Дней',
  'Отгулы нарастающим итогом, дн.', 'Больничные нарастающим итогом, дн.', 'Комментарий',
  'Статус', 'Кем решено', 'Когда решено'
];
var ABS_COL = {
  CREATED: 1, NAME: 2, PHONE: 3, TYPE: 4, FROM: 5, TO: 6,
  TIME_FROM: 7, TIME_TO: 8, HOURS: 9, DAYS: 10, CUM_LEAVE: 11, CUM_SICK: 12, COMMENT: 13,
  STATUS: 14, DECIDED_BY: 15, DECIDED_AT: 16
};
var ABS_STATUS = { PENDING: 'На согласовании', APPROVED: 'Согласовано', REJECTED: 'Не согласовано' };

function absStatusOf_(v) { return String(v || '').trim() || ABS_STATUS.PENDING; }
var ABSENCE_KINDS = { leave: 'Отгул', sick: 'Больничный', late: 'Приду позже', early: 'Уйду раньше' };

// Для чтения: null, если листа ещё нет; иначе лист с гарантированно
// полным набором заголовков/колонок (на случай листа от v29/v30).
function getExistingAbsenceSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABSENCE_SHEET_NAME) ? getAbsenceSheet_() : null;
}

function getAbsenceSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(ABSENCE_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(ABSENCE_SHEET_NAME);
    sheet.getRange(1, 1, 1, ABSENCE_HEADERS.length).setValues([ABSENCE_HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else if (sheet.getRange(1, ABS_COL.STATUS).getValue() !== 'Статус') {
    // лист создан версией v29/v30 — дописываем недостающие заголовки
    sheet.getRange(1, 1, 1, ABSENCE_HEADERS.length).setValues([ABSENCE_HEADERS]).setFontWeight('bold');
  }
  return sheet;
}

// Пересчитывает "нарастающим итогом" для всех строк: по каждому сотруднику
// и году начала, в порядке строк листа, суммируя только СОГЛАСОВАННЫЕ.
function recomputeAbsenceCumulative_(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return;
  var rows = sheet.getRange(2, 1, last - 1, ABSENCE_HEADERS.length).getValues();
  var run = {};
  var out = rows.map(function (r) {
    var f = r[ABS_COL.FROM - 1];
    var key = normalizePhone_(r[ABS_COL.PHONE - 1]) + '|' + (f instanceof Date ? f.getFullYear() : '');
    var acc = run[key] || (run[key] = { leave: 0, sick: 0 });
    if (absStatusOf_(r[ABS_COL.STATUS - 1]) === ABS_STATUS.APPROVED) {
      var d = Number(r[ABS_COL.DAYS - 1]) || 0;
      if (r[ABS_COL.TYPE - 1] === ABSENCE_KINDS.sick) acc.sick += d; else acc.leave += d;
    }
    return [round2_(acc.leave), round2_(acc.sick)];
  });
  sheet.getRange(2, ABS_COL.CUM_LEAVE, out.length, 2).setValues(out);
}

function parseIsoDate_(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return null;
  var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (d.getMonth() !== Number(m[2]) - 1) return null;
  return d;
}

function toIsoDate_(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function timeToMinutes_(s) {
  var m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(s || '').trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

function countWorkdays_(from, to) {
  var n = 0;
  var d = new Date(from.getTime());
  while (d <= to) {
    var w = d.getDay();
    if (w !== 0 && w !== 6) n++;
    d.setDate(d.getDate() + 1);
  }
  return n;
}

function round2_(x) { return Math.round(x * 100) / 100; }

function submitAbsence(phone, kind, dateFrom, dateTo, timeFrom, timeTo, comment) {
  var emp = findEmployeeByPhone_(phone);
  if (!emp) return { status: 'error', message: 'Сотрудник не найден' };
  var typeLabel = ABSENCE_KINDS[kind];
  if (!typeLabel) return { status: 'error', message: 'Неизвестный тип заявки' };

  var from = parseIsoDate_(dateFrom);
  if (!from) return { status: 'error', message: 'Укажите дату' };
  var isPartial = (kind === 'late' || kind === 'early');
  var to = isPartial ? from : parseIsoDate_(dateTo);
  if (!to) return { status: 'error', message: 'Укажите дату окончания' };
  if (to < from) return { status: 'error', message: 'Дата окончания раньше даты начала' };
  if ((to - from) / 86400000 > 366) return { status: 'error', message: 'Слишком длинный период' };

  var hours, tFrom = '', tTo = '';
  if (isPartial) {
    // Одно время: "приду к T" (отсутствую с начала дня до T) или
    // "уйду в T" (отсутствую с T до конца дня).
    var t = timeToMinutes_(timeFrom);
    var dayStart = timeToMinutes_(OFFICE_START), dayEnd = timeToMinutes_(OFFICE_END);
    if (t === null) return { status: 'error', message: 'Укажите время в формате ЧЧ:ММ' };
    var a, b;
    if (kind === 'late') {
      if (t <= dayStart) return { status: 'error', message: 'Время должно быть позже начала рабочего дня (' + OFFICE_START + ')' };
      a = dayStart; b = Math.min(t, dayEnd);
    } else {
      if (t >= dayEnd) return { status: 'error', message: 'Время должно быть раньше конца рабочего дня (' + OFFICE_END + ')' };
      a = Math.max(t, dayStart); b = dayEnd;
    }
    hours = Math.min(round2_((b - a) / 60), WORKDAY_HOURS);
    function hhmm_(m) { return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2); }
    tFrom = hhmm_(a);
    tTo = hhmm_(b);
  } else {
    var workdays = countWorkdays_(from, to);
    if (workdays === 0) return { status: 'error', message: 'В выбранном периоде нет рабочих дней (пн–пт)' };
    hours = workdays * WORKDAY_HOURS;
  }
  var days = round2_(hours / WORKDAY_HOURS);
  var isSick = (kind === 'sick');
  var year = from.getFullYear();

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = getAbsenceSheet_();
    var last = sheet.getLastRow();
    var row = last + 1;
    sheet.getRange(row, ABS_COL.PHONE).setNumberFormat('@');
    sheet.getRange(row, ABS_COL.TIME_FROM, 1, 2).setNumberFormat('@');
    sheet.getRange(row, ABS_COL.FROM, 1, 2).setNumberFormat('dd.MM.yyyy');
    sheet.getRange(row, ABS_COL.CREATED).setNumberFormat('dd.MM.yyyy HH:mm');
    sheet.getRange(row, 1, 1, ABSENCE_HEADERS.length).setValues([[
      new Date(), emp.name, emp.phone, typeLabel, from, to, tFrom, tTo,
      hours, days, 0, 0, String(comment || '').slice(0, 500),
      ABS_STATUS.PENDING, '', ''
    ]]);
    recomputeAbsenceCumulative_(sheet);
  } finally {
    lock.releaseLock();
  }
  return getMyAbsences(phone, year);
}

function getMyAbsences(phone, year) {
  var emp = findEmployeeByPhone_(phone);
  if (!emp) return { status: 'error', message: 'Сотрудник не найден' };
  year = Number(year) || new Date().getFullYear();
  var items = [];
  var leaveDays = 0, sickDays = 0, leaveHours = 0, sickHours = 0, pendingDays = 0;
  var sheet = getExistingAbsenceSheet_();
  if (sheet && sheet.getLastRow() >= 2) {
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, ABSENCE_HEADERS.length).getValues();
    rows.forEach(function (r) {
      if (normalizePhone_(r[ABS_COL.PHONE - 1]) !== emp.phone) return;
      var f = r[ABS_COL.FROM - 1], t = r[ABS_COL.TO - 1];
      if (!(f instanceof Date) || f.getFullYear() !== year) return;
      var hours = Number(r[ABS_COL.HOURS - 1]) || 0;
      var days = Number(r[ABS_COL.DAYS - 1]) || 0;
      var type = r[ABS_COL.TYPE - 1];
      var status = absStatusOf_(r[ABS_COL.STATUS - 1]);
      if (status === ABS_STATUS.PENDING) pendingDays += days;
      else if (status === ABS_STATUS.APPROVED) {
        if (type === ABSENCE_KINDS.sick) { sickDays += days; sickHours += hours; }
        else { leaveDays += days; leaveHours += hours; }
      }
      items.push({
        type: type,
        dateFrom: toIsoDate_(f),
        dateTo: t instanceof Date ? toIsoDate_(t) : toIsoDate_(f),
        timeFrom: String(r[ABS_COL.TIME_FROM - 1] || ''),
        timeTo: String(r[ABS_COL.TIME_TO - 1] || ''),
        hours: hours,
        days: days,
        comment: String(r[ABS_COL.COMMENT - 1] || ''),
        status: status
      });
    });
  }
  items.sort(function (a, b) { return a.dateFrom < b.dateFrom ? 1 : (a.dateFrom > b.dateFrom ? -1 : 0); });
  return {
    status: 'ok',
    year: year,
    items: items,
    totals: {
      leaveDays: round2_(leaveDays), leaveHours: round2_(leaveHours),
      sickDays: round2_(sickDays), sickHours: round2_(sickHours),
      pendingDays: round2_(pendingDays)
    }
  };
}

// ---- Согласование (для админа) ----
function adminGetAbsences(phone) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };
  var sheet = getExistingAbsenceSheet_();
  var items = [];
  if (sheet && sheet.getLastRow() >= 2) {
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, ABSENCE_HEADERS.length).getValues();
    rows.forEach(function (r, i) {
      var f = r[ABS_COL.FROM - 1], t = r[ABS_COL.TO - 1];
      if (!(f instanceof Date)) return;
      items.push({
        id: i + 2,
        name: r[ABS_COL.NAME - 1],
        phone: normalizePhone_(r[ABS_COL.PHONE - 1]),
        type: r[ABS_COL.TYPE - 1],
        dateFrom: toIsoDate_(f),
        dateTo: t instanceof Date ? toIsoDate_(t) : toIsoDate_(f),
        timeFrom: String(r[ABS_COL.TIME_FROM - 1] || ''),
        timeTo: String(r[ABS_COL.TIME_TO - 1] || ''),
        hours: Number(r[ABS_COL.HOURS - 1]) || 0,
        days: Number(r[ABS_COL.DAYS - 1]) || 0,
        comment: String(r[ABS_COL.COMMENT - 1] || ''),
        status: absStatusOf_(r[ABS_COL.STATUS - 1]),
        decidedBy: String(r[ABS_COL.DECIDED_BY - 1] || '')
      });
    });
  }
  // сперва ожидающие, внутри групп — свежие даты выше
  var rank = {};
  rank[ABS_STATUS.PENDING] = 0; rank[ABS_STATUS.APPROVED] = 1; rank[ABS_STATUS.REJECTED] = 1;
  items.sort(function (a, b) {
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    return a.dateFrom < b.dateFrom ? 1 : (a.dateFrom > b.dateFrom ? -1 : 0);
  });
  var pending = items.filter(function (x) { return x.status === ABS_STATUS.PENDING; }).length;
  return { status: 'ok', items: items, pendingCount: pending };
}

function adminDecideAbsence(phone, id, decision) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };
  var newStatus = decision === 'approve' ? ABS_STATUS.APPROVED
    : (decision === 'reject' ? ABS_STATUS.REJECTED : null);
  if (!newStatus) return { status: 'error', message: 'Неизвестное решение' };
  var row = Number(id);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = getAbsenceSheet_();
    if (!(row >= 2 && row <= sheet.getLastRow())) return { status: 'error', message: 'Заявка не найдена' };
    var admin = findEmployeeByPhone_(auth.phone);
    sheet.getRange(row, ABS_COL.STATUS, 1, 3).setValues([[
      newStatus, admin ? admin.name : auth.phone, new Date()
    ]]);
    sheet.getRange(row, ABS_COL.DECIDED_AT).setNumberFormat('dd.MM.yyyy HH:mm');
    recomputeAbsenceCumulative_(sheet);
  } finally {
    lock.releaseLock();
  }
  return adminGetAbsences(phone);
}

// Читает только колонку "Статус" — дёшево, можно опрашивать раз в минуту.
function adminAbsencePending(phone) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };
  var sheet = getExistingAbsenceSheet_();
  var pending = 0;
  if (sheet && sheet.getLastRow() >= 2) {
    var n = sheet.getLastRow() - 1;
    var phones = sheet.getRange(2, ABS_COL.PHONE, n, 1).getValues();
    var statuses = sheet.getRange(2, ABS_COL.STATUS, n, 1).getValues();
    for (var i = 0; i < n; i++) {
      if (!String(phones[i][0]).trim()) continue;
      if (absStatusOf_(statuses[i][0]) === ABS_STATUS.PENDING) pending++;
    }
  }
  return { status: 'ok', pendingCount: pending };
}


// ===== Расходы (админ) — запись в лист "Расходы SEVMOD (копия)" нашей таблицы =====
var EXPENSE_SHEET_NAME = 'Расходы SEVMOD (копия)';
var EXPENSE_DEFAULT_STATUS = 'НЕ ОПЛАЧЕНО';

// Находит (или создаёт) лист и строку заголовков (в первых 30 строках: есть
// "Дата", "Работник", "Объект", "Ставка"), возвращает номера колонок по
// названиям — запись не ломается, если порядок столбцов изменили.
function expenseLayout_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(EXPENSE_SHEET_NAME);
  if (!sheet) return { error: 'В таблице нет листа «' + EXPENSE_SHEET_NAME + '».' };
  var width = Math.max(sheet.getLastColumn(), 6);
  var rows = Math.max(1, Math.min(30, sheet.getMaxRows()));
  var top = sheet.getRange(1, 1, rows, width).getValues();

  function find_() {
    for (var r = 0; r < top.length; r++) {
      var cols = {};
      for (var c = 0; c < width; c++) {
        var h = String(top[r][c] || '').trim().toLowerCase();
        if (!h) continue;
        if (h.indexOf('дата погаш') === 0 && !cols.payDate) cols.payDate = c + 1;
        else if (h.indexOf('дата') === 0 && !cols.date) cols.date = c + 1;
        else if (h.indexOf('бригадир') === 0 && !cols.brigadier) cols.brigadier = c + 1;
        else if (h.indexOf('работник') === 0 && !cols.worker) cols.worker = c + 1;
        else if (h.indexOf('объект') === 0 && !cols.object) cols.object = c + 1;
        else if (h.indexOf('ставка') === 0 && !cols.rate) cols.rate = c + 1;
        else if (h.indexOf('комментар') === 0 && !cols.comment) cols.comment = c + 1;
        else if (h.indexOf('месяц') === 0 && !cols.month) cols.month = c + 1;
        else if (h.indexOf('кол-во') === 0 && !cols.count) cols.count = c + 1;
        else if (h.indexOf('итого') === 0 && !cols.total) cols.total = c + 1;
        else if (h.indexOf('статус') === 0 && !cols.status) cols.status = c + 1;
      }
      if (cols.date && cols.rate && cols.worker && cols.object) {
        return { sheet: sheet, headerRow: r + 1, cols: cols };
      }
    }
    return null;
  }

  var found = find_();
  if (found) return found;
  return { error: 'В листе «' + EXPENSE_SHEET_NAME + '» не найдена строка заголовков (Дата, Работник, Объект, Ставка).' };
}

var EXPENSE_MAX_DAYS = 62;

// Разрешённые значения ячейки из её проверки данных (выпадающий список из
// перечня или из диапазона). null — проверки нет или она не списочная.
// strict — недопустимое значение таблица отклонит.
function expenseAllowed_(sheet, row, col) {
  if (!col) return null;
  var rule = sheet.getRange(row, col).getDataValidation();
  if (!rule) return null;
  var type = rule.getCriteriaType();
  var list = [];
  try {
    var args = rule.getCriteriaValues();
    if (type === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) {
      list = (args[0] || []).map(String);
    } else if (type === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE) {
      args[0].getDisplayValues().forEach(function (r) { r.forEach(function (v) { list.push(v); }); });
    } else {
      return null;
    }
  } catch (e) {
    // Список ссылается на несуществующий лист/диапазон ("Диапазон не найден").
    return { broken: true, values: [], strict: !rule.getAllowInvalid() };
  }
  var seen = {}, values = [];
  list.forEach(function (v) {
    v = String(v).trim();
    if (v && !seen[v]) { seen[v] = true; values.push(v); }
  });
  return { values: values, strict: !rule.getAllowInvalid() };
}

// Чинит проверку данных, ссылающуюся на несуществующий диапазон.
// Для колонки объектов — заново ставит список из листа "Объекты" (A2:A) на
// всю колонку под заголовком и возвращает новые разрешённые значения.
// Иначе — снимает проверку только со строк, куда сейчас пишем; вернёт null.
function repairExpenseValidation_(sheet, headerRow, col, isObjectCol, row, days) {
  var objSheet = isObjectCol ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты') : null;
  if (objSheet) {
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(objSheet.getRange('A2:A'), true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange(headerRow + 1, col, sheet.getMaxRows() - headerRow, 1).setDataValidation(rule);
    var seen = {}, values = [];
    getValidObjects().forEach(function (v) { if (!seen[v]) { seen[v] = true; values.push(v); } });
    return { values: values, strict: true };
  }
  if (row + days - 1 > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), row + days - 1 - sheet.getMaxRows());
  sheet.getRange(row, col, days, 1).clearDataValidations();
  return null;
}

// ----- Справочник работников и бригадиров для расходов -----
var EXPENSE_REF_SHEET_NAME = 'Справочник расходов';

function getExpenseRefSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(EXPENSE_REF_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(EXPENSE_REF_SHEET_NAME);
    sheet.getRange(1, 1, 1, 2).setValues([['Работники', 'Бригадиры']]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, 2, 220);
  }
  return sheet;
}

function expenseRefColumn_(sheet, col) {
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var seen = {}, out = [];
  sheet.getRange(2, col, last - 1, 1).getDisplayValues().forEach(function (r) {
    var v = String(r[0]).trim();
    if (v && !seen[v]) { seen[v] = true; out.push(v); }
  });
  return out;
}

// { workers, brigadiers, objects, brigadierCol } — списки для жёсткого выбора.
// Если колонка "Бригадиры" пустая, бригадиры = работники (brigadierCol = 1).
function getExpenseRefLists_() {
  var ref = getExpenseRefSheet_();
  var workers = expenseRefColumn_(ref, 1);
  var brigadiers = expenseRefColumn_(ref, 2);
  var brigadierCol = 2;
  if (!brigadiers.length) { brigadiers = workers; brigadierCol = 1; }
  return { ref: ref, workers: workers, brigadiers: brigadiers, brigadierCol: brigadierCol, objects: getValidObjects() };
}

// Строгие выпадающие списки на колонки листа расходов (все строки под
// заголовком). Пустой список не ставится, чтобы не заблокировать колонку.
function applyExpenseStrictLists_(sheet, lay, lists) {
  var n = sheet.getMaxRows() - lay.headerRow;
  if (n < 1) return;
  function strict_(col, range) {
    if (!col) return;
    var rule = SpreadsheetApp.newDataValidation().requireValueInRange(range, true).setAllowInvalid(false).build();
    sheet.getRange(lay.headerRow + 1, col, n, 1).setDataValidation(rule);
  }
  if (lists.workers.length) strict_(lay.cols.worker, lists.ref.getRange('A2:A'));
  if (lists.brigadiers.length) strict_(lay.cols.brigadier, lists.ref.getRange(lists.brigadierCol === 2 ? 'B2:B' : 'A2:A'));
  var objSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Объекты');
  if (objSheet && lists.objects.length) strict_(lay.cols.object, objSheet.getRange('A2:A'));
  ensureExpenseStatuses_(sheet, lay);
}

function applyExpenseStrictListsManual() {
  var lay = expenseLayout_();
  if (lay.error) { SpreadsheetApp.getUi().alert(lay.error); return; }
  var lists = getExpenseRefLists_();
  applyExpenseStrictLists_(lay.sheet, lay, lists);
  SpreadsheetApp.getActiveSpreadsheet().toast(
    lists.workers.length
      ? 'Строгие списки включены: работников ' + lists.workers.length + ', объектов ' + lists.objects.length
      : 'Заполните колонку «Работники» на листе «' + EXPENSE_REF_SHEET_NAME + '» и повторите',
    'SEVMOD', 5);
}

// Значение из списка (без учёта регистра/пробелов) или null.
function pickFromList_(list, value) {
  var key = String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  if (!key) return '';
  for (var i = 0; i < list.length; i++) {
    if (list[i].replace(/\s+/g, ' ').trim().toLowerCase() === key) return list[i];
  }
  return null;
}

// Последняя строка с данными (есть работник, объект или ставка); headerRow,
// если данных нет. Формулы, протянутые вниз по пустым строкам, не считаются.
function expenseLastDataRow_(sheet, lay) {
  var first = lay.headerRow + 1;
  var lastRow = sheet.getLastRow();
  if (lastRow < first) return lay.headerRow;
  var n = lastRow - first + 1;
  var cols = lay.cols;
  var blocks = [cols.worker, cols.object, cols.rate].map(function (c) {
    return sheet.getRange(first, c, n, 1).getValues();
  });
  for (var i = n - 1; i >= 0; i--) {
    if (String(blocks[0][i][0]).trim() || String(blocks[1][i][0]).trim() || String(blocks[2][i][0]).trim()) {
      return first + i;
    }
  }
  return lay.headerRow;
}

// Фильтр на строке заголовков (если его нет) и сортировка строк с данными по
// дате. Формулы в строках (=MONTH(B…), =E…*H…) Google при сортировке
// переносит вместе со строкой.
function sortExpensesByDate_(sheet, lay) {
  var lastCol = sheet.getLastColumn();
  if (!sheet.getFilter()) {
    sheet.getRange(lay.headerRow, 1, sheet.getMaxRows() - lay.headerRow + 1, lastCol).createFilter();
  }
  var last = expenseLastDataRow_(sheet, lay);
  if (last - lay.headerRow < 2) return;
  sheet.getRange(lay.headerRow + 1, 1, last - lay.headerRow, lastCol)
    .sort({ column: lay.cols.date, ascending: true });
}

function sortExpensesByDateManual() {
  var lay = expenseLayout_();
  if (lay.error) { SpreadsheetApp.getUi().alert(lay.error); return; }
  sortExpensesByDate_(lay.sheet, lay);
  SpreadsheetApp.getActiveSpreadsheet().toast('Расходы отсортированы по дате', 'SEVMOD', 3);
}

// Подгоняет значение под список (без учёта регистра и лишних пробелов).
// Возвращает значение из списка, исходное (если списка нет / он не строгий)
// или null (строгий список, значения в нём нет).
function expenseMatch_(allowed, value) {
  if (!value || !allowed) return value;
  var key = value.replace(/\s+/g, ' ').toLowerCase();
  for (var i = 0; i < allowed.values.length; i++) {
    if (allowed.values[i].replace(/\s+/g, ' ').toLowerCase() === key) return allowed.values[i];
  }
  return allowed.strict ? null : value;
}

var EXPENSE_MAX_ROWS = 600;

// Запись расходов. Работники — либо один (worker + rate), либо список entries
// [{ worker, rate }] (бригада: у каждого своя ставка). dateToIso — конец
// периода (включительно): на каждый день и каждого работника — своя строка.
function adminAddExpense(phone, dateIso, worker, brigadier, objectName, rate, comment, dateToIso, entries, status) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };

  var date = parseIsoDate_(dateIso);
  if (!date) return { status: 'error', message: 'Укажите дату' };
  var dateTo = dateToIso ? parseIsoDate_(dateToIso) : date;
  if (!dateTo) return { status: 'error', message: 'Неверная дата окончания периода' };
  if (dateTo < date) return { status: 'error', message: 'Дата окончания раньше даты начала' };
  var dates = [];
  for (var d = new Date(date.getTime()); d <= dateTo; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d.getTime()));
    if (dates.length > EXPENSE_MAX_DAYS) {
      return { status: 'error', message: 'Слишком длинный период — не больше ' + EXPENSE_MAX_DAYS + ' дней' };
    }
  }
  var days = dates.length;

  // Жёсткий выбор: работники, бригадир и объект — только из списков.
  var lists = getExpenseRefLists_();
  if (!lists.workers.length) {
    return { status: 'error', message: 'Список работников пуст — заполните колонку «Работники» на листе «' + EXPENSE_REF_SHEET_NAME + '».' };
  }
  var pickedBrigadier = pickFromList_(lists.brigadiers, brigadier);
  if (pickedBrigadier === null) return { status: 'error', message: 'Бригадира «' + String(brigadier).trim() + '» нет в списке. Выберите из списка.' };
  var pickedObject = pickFromList_(lists.objects, objectName);
  if (pickedObject === null) return { status: 'error', message: 'Объекта «' + String(objectName).trim() + '» нет в списке. Выберите из списка.' };
  if (!pickedObject) return { status: 'error', message: 'Укажите объект' };
  brigadier = pickedBrigadier;
  objectName = pickedObject;
  comment = String(comment || '').trim().slice(0, 500);

  var raw = (entries && entries.length) ? entries : [{ worker: worker, rate: rate }];
  var people = [], seenPeople = {};
  for (var ei = 0; ei < raw.length; ei++) {
    var w = pickFromList_(lists.workers, raw[ei] && raw[ei].worker);
    if (w === null) return { status: 'error', message: 'Работника «' + String(raw[ei].worker).trim() + '» нет в списке. Выберите из списка.' };
    if (!w) return { status: 'error', message: 'Укажите работника' };
    var amt = Number(String(raw[ei].rate).replace(/\s/g, '').replace(',', '.'));
    if (!isFinite(amt) || amt <= 0) return { status: 'error', message: 'Укажите ставку для «' + w + '» (число больше нуля)' };
    if (seenPeople[w]) continue;
    seenPeople[w] = true;
    people.push({ worker: w, rate: amt });
  }
  if (!people.length) return { status: 'error', message: 'Выберите хотя бы одного работника' };

  // Строки: по дням, внутри дня — по работникам.
  var rowsData = [];
  dates.forEach(function (dt) {
    people.forEach(function (pp) { rowsData.push({ date: dt, worker: pp.worker, rate: pp.rate }); });
  });
  var count = rowsData.length;
  if (count > EXPENSE_MAX_ROWS) {
    return { status: 'error', message: 'Слишком много строк за раз (' + count + '). Сократите период или число работников.' };
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var lay = expenseLayout_();
    if (lay.error) return { status: 'error', message: lay.error };
    var sheet = lay.sheet, cols = lay.cols;
    applyExpenseStrictLists_(sheet, lay, lists);

    var lastUsed = expenseLastDataRow_(sheet, lay);
    var row = lastUsed + 1;
    var rowTo = row + count - 1;
    if (rowTo > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), rowTo - sheet.getMaxRows());

    var warn = [];
    // Статус — выбранный в приложении (или по умолчанию), строго из списка.
    var statusValue = '';
    if (cols.status) {
      var statusList = expenseStatusList_(sheet, lay);
      statusValue = pickFromList_(statusList, String(status || '').trim() || EXPENSE_DEFAULT_STATUS);
      if (statusValue === null) {
        if (String(status || '').trim()) {
          return { status: 'error', message: 'Статуса «' + String(status).trim() + '» нет в списке колонки «Статус».' };
        }
        statusValue = '';
      }
    }

    function column_(col, fn) {
      if (!col) return null;
      return sheet.getRange(row, col, count, 1).setValues(rowsData.map(function (x) { return [fn(x)]; }));
    }
    column_(cols.date, function (x) { return x.date; }).setNumberFormat('dd.MM.yyyy');
    column_(cols.worker, function (x) { return x.worker; });
    column_(cols.brigadier, function () { return brigadier; });
    column_(cols.object, function () { return objectName; });
    column_(cols.rate, function (x) { return x.rate; });
    column_(cols.comment, function () { return comment; });

    // Служебные колонки: формулу предыдущей строки протягиваем, иначе значение.
    function fillAuto_(col, fn) {
      if (!col) return;
      var top2 = sheet.getRange(lay.headerRow, col, 2, 1).getFormulas();
      if (/ARRAYFORMULA/i.test(top2[0][0] + top2[1][0])) return;
      var formula = lastUsed > lay.headerRow ? sheet.getRange(lastUsed, col).getFormulaR1C1() : '';
      if (formula) sheet.getRange(row, col, count, 1).setFormulaR1C1(formula);
      else column_(col, fn);
    }
    fillAuto_(cols.month, function (x) { return x.date.getMonth() + 1; });
    fillAuto_(cols.count, function () { return 1; });
    fillAuto_(cols.total, function (x) { return x.rate; });
    fillAuto_(cols.status, function () { return statusValue; });
    SpreadsheetApp.flush();

    var sorted = false;
    try {
      sortExpensesByDate_(sheet, lay);
      SpreadsheetApp.flush();
      sorted = true;
    } catch (e) {
      warn.push('строки добавлены в конец, но отсортировать лист по дате не удалось: ' + e.message);
    }
    if (!cols.brigadier && brigadier) warn.push('в таблице нет столбца «Бригадир» — бригадир не записан');
    if (!cols.comment && comment) warn.push('в таблице нет столбца «Комментарий» — комментарий не записан');
    var total = rowsData.reduce(function (a, x) { return a + x.rate; }, 0);
    return {
      status: 'ok', row: row, rowTo: rowTo, days: days, rows: count, people: people.length,
      total: total, sorted: sorted, warning: warn.join('; ')
    };
  } finally {
    lock.releaseLock();
  }
}

// По листу расходов: состав бригад (работники самой поздней даты, на которую
// есть записи с этим бригадиром, + их ставки в тот день) и последняя ставка
// каждого работника.
function expenseHistory_() {
  var lay = expenseLayout_();
  var out = { brigades: {}, lastRates: {} };
  if (lay.error) return out;
  var sheet = lay.sheet, cols = lay.cols;
  var last = expenseLastDataRow_(sheet, lay);
  var first = lay.headerRow + 1;
  if (last < first) return out;
  var n = last - first + 1;
  function col_(c) { return c ? sheet.getRange(first, c, n, 1).getValues() : null; }
  var dts = col_(cols.date), ws = col_(cols.worker), bs = col_(cols.brigadier), rs = col_(cols.rate);
  var brigDate = {}, rateDate = {};
  for (var i = 0; i < n; i++) {
    var dt = dts[i][0] instanceof Date ? dts[i][0].getTime() : 0;
    var w = String(ws[i][0] || '').trim();
    var r = Number(rs[i][0]) || 0;
    if (!w) continue;
    if (r > 0 && (rateDate[w] === undefined || dt >= rateDate[w])) { rateDate[w] = dt; out.lastRates[w] = r; }
    var b = bs ? String(bs[i][0] || '').trim() : '';
    if (!b) continue;
    if (brigDate[b] === undefined || dt > brigDate[b]) { brigDate[b] = dt; out.brigades[b] = {}; }
    if (dt === brigDate[b]) out.brigades[b][w] = r;
  }
  Object.keys(out.brigades).forEach(function (b) {
    var m = out.brigades[b];
    out.brigades[b] = Object.keys(m).map(function (w) { return { worker: w, rate: m[w] }; });
  });
  return out;
}

// Шапка листа: в каждой строке над заголовками — подпись и (правее) число,
// плюс цвет ячейки подписи. [{ label, value (null — суммы нет), color }].
function expenseSummary_(sheet, lay) {
  var lastCol = sheet.getLastColumn();
  var summary = [];
  if (lay.headerRow > 1) {
    var top = sheet.getRange(1, 1, lay.headerRow - 1, lastCol);
    var disp = top.getDisplayValues(), vals = top.getValues(), bgs = top.getBackgrounds();
    for (var r = 0; r < disp.length; r++) {
      var labelCol = -1;
      for (var c = 0; c < lastCol; c++) {
        var t = String(disp[r][c]).trim();
        if (!t || /^заполняется/i.test(t) || typeof vals[r][c] === 'number') continue;
        labelCol = c; break;
      }
      if (labelCol < 0) continue;
      var value = null;
      for (var c2 = labelCol + 1; c2 < lastCol; c2++) {
        if (typeof vals[r][c2] === 'number') { value = vals[r][c2]; break; }
      }
      summary.push({ label: String(disp[r][labelCol]).trim(), value: value, color: bgs[r][labelCol] });
    }
  }
  return summary;
}

// Добавляет в выпадающий список колонки "Статус" статусы из сводки шапки,
// которых в нём нет (сравнение без учёта регистра). Существующие значения
// сохраняются. Правило меняется, только если чего-то не хватает.
function ensureExpenseStatuses_(sheet, lay) {
  var col = lay.cols.status;
  if (!col) return;
  var n = sheet.getMaxRows() - lay.headerRow;
  if (n < 1) return;
  var current = [];
  var rule = sheet.getRange(lay.headerRow + 1, col).getDataValidation();
  if (rule && rule.getCriteriaType() === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) {
    current = (rule.getCriteriaValues()[0] || []).map(function (v) { return String(v).trim(); }).filter(String);
  }
  var have = {};
  current.forEach(function (v) { have[v.toLowerCase()] = true; });
  var missing = [];
  expenseSummary_(sheet, lay).forEach(function (x) {
    var k = x.label.toLowerCase();
    if (x.label && !have[k]) { have[k] = true; missing.push(x.label); }
  });
  if (!have[EXPENSE_DEFAULT_STATUS.toLowerCase()]) missing.push(EXPENSE_DEFAULT_STATUS);
  if (!missing.length) return;
  var newRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(current.concat(missing), true)
    .setAllowInvalid(rule ? rule.getAllowInvalid() : false)
    .build();
  sheet.getRange(lay.headerRow + 1, col, n, 1).setDataValidation(newRule);
}

// Допустимые статусы: выпадающий список колонки "Статус" (после
// ensureExpenseStatuses_), а если его нет — статусы из сводки шапки.
function expenseStatusList_(sheet, lay) {
  if (!lay.cols.status) return [];
  try { ensureExpenseStatuses_(sheet, lay); } catch (e) { /* список ниже всё равно прочитаем */ }
  var allowed = expenseAllowed_(sheet, lay.headerRow + 1, lay.cols.status);
  if (allowed && !allowed.broken && allowed.values.length) return allowed.values;
  var out = expenseSummary_(sheet, lay).map(function (x) { return x.label; });
  if (!pickFromList_(out, EXPENSE_DEFAULT_STATUS)) out.unshift(EXPENSE_DEFAULT_STATUS);
  return out;
}

// Сводка (шапка листа) + строки расходов для экранов "Расходы" и
// "Посмотреть расходы".
function adminExpenseOverview(phone) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };
  var lay = expenseLayout_();
  if (lay.error) return { status: 'error', message: lay.error };
  var sheet = lay.sheet, cols = lay.cols;
  var lastCol = sheet.getLastColumn();
  var tz = Session.getScriptTimeZone();

  try { ensureExpenseStatuses_(sheet, lay); } catch (e) { /* обзор важнее */ }
  var summary = expenseSummary_(sheet, lay);

  // Строки расходов.
  var rows = [];
  var last = expenseLastDataRow_(sheet, lay);
  var first = lay.headerRow + 1;
  if (last >= first) {
    var n = last - first + 1;
    var data = sheet.getRange(first, 1, n, lastCol).getValues();
    function v_(row, col) { return col ? row[col - 1] : ''; }
    function iso_(x) { return x instanceof Date ? Utilities.formatDate(x, tz, 'yyyy-MM-dd') : ''; }
    for (var i = 0; i < n; i++) {
      var row = data[i];
      var worker = String(v_(row, cols.worker) || '').trim();
      var rate = Number(v_(row, cols.rate)) || 0;
      if (!worker && !rate) continue;
      var cnt = Number(v_(row, cols.count)) || 1;
      var total = Number(v_(row, cols.total));
      if (!isFinite(total) || v_(row, cols.total) === '') total = rate * cnt;
      rows.push([
        iso_(v_(row, cols.date)),
        worker,
        String(v_(row, cols.brigadier) || '').trim(),
        String(v_(row, cols.object) || '').trim(),
        rate,
        total,
        String(v_(row, cols.status) || '').trim(),
        iso_(v_(row, cols.payDate)),
        String(v_(row, cols.comment) || '').trim()
      ]);
    }
  }
  return {
    status: 'ok',
    summary: summary,
    fields: ['date', 'worker', 'brigadier', 'object', 'rate', 'total', 'status', 'payDate', 'comment'],
    rows: rows,
    updatedAt: Utilities.formatDate(new Date(), tz, 'dd.MM.yyyy HH:mm')
  };
}

// Списки для формы — те же, что проверяются при записи (жёсткий выбор):
// работники и бригадиры из листа "Справочник расходов", объекты из "Объекты".
function adminExpenseLookups(phone) {
  var auth = adminAuth_(phone);
  if (!auth.ok) return { status: 'error', message: auth.error };
  var lists = getExpenseRefLists_();
  function sorted_(a) { return a.slice().sort(function (x, y) { return x.localeCompare(y, 'ru'); }); }
  var hist = { brigades: {}, lastRates: {} };
  try { hist = expenseHistory_(); } catch (e) { /* подсказки необязательны */ }
  var statuses = [], statusColors = {};
  try {
    var lay = expenseLayout_();
    if (!lay.error) {
      statuses = expenseStatusList_(lay.sheet, lay);
      expenseSummary_(lay.sheet, lay).forEach(function (x) { statusColors[x.label.toLowerCase()] = x.color; });
    }
  } catch (e) { /* без списка статусов форма предложит только статус по умолчанию */ }
  return {
    status: 'ok',
    strict: true,
    workers: sorted_(lists.workers),
    brigadiers: sorted_(lists.brigadiers),
    objects: sorted_(lists.objects),
    brigades: hist.brigades,
    lastRates: hist.lastRates,
    statuses: statuses,
    statusColors: statusColors,
    defaultStatus: pickFromList_(statuses, EXPENSE_DEFAULT_STATUS) || EXPENSE_DEFAULT_STATUS,
    refSheet: EXPENSE_REF_SHEET_NAME
  };
}
