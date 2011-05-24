/***
|''Name:''|RussianTranslationPlugin|
|''Description:''|Translation of TiddlyWiki into Russian|
|''Author:''|VitalyPetrov (v31337 (at) gmail (dot) com)|
|''Author:''|Demid Lupin (v31337 (at) gmail (dot) com)|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/association/locales/core/ru/locale.ru.js |
|''Version:''|0.0.3|
|''Date:''|Nov 12, 2009|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]] |
|''~CoreVersion:''|2.5.2|
***/

//{{{
//--
//-- Translateable strings
//--

// Strings in "double quotes" should be translated; strings in 'single quotes' should be left alone

config.locale = "ru"; // W3C language tag

if (config.options.txtUserName == 'YourName') // do not translate this line, but do translate the next line
	merge(config.options,{txtUserName: "ИмяПользователя"});

merge(config.tasks,{
	save: {text: "сохранить", tooltip: "Сохранить изменения в текущей TiddlyWiki", action: saveChanges},
	sync: {text: "синхронизировать", tooltip: "Синхронизировать все изменения с другими файлами и серверами TiddlyWiki", content: '<<sync>>'},
	importTask: {text: "импорт", tooltip: "Импорт записей и дополнений из других файлов и серверов TiddlyWiki", content: '<<importTiddlers>>'},
	tweak: {text: "настроки", tooltip: "Настроить внешний вид и поведение TiddlyWiki", content: '<<options>>'},
	upgrade: {text: "обновить", tooltip: "Обновить основной код TiddlyWiki", content: '<<upgrade>>'},
	plugins: {text: "дополнения", tooltip: "Управление установленными дополнениями", content: '<<plugins>>'}
});

// Options that can be set in the options panel and/or cookies
merge(config.optionsDesc,{
	txtUserName: "Имя пользователя для подписи ваших записей",
	chkRegExpSearch: "Разрешить использование регулярных выражений в поиске",
	chkCaseSensitiveSearch: "Поиск с учётом регистра",
	chkIncrementalSearch: "Поиск по мере набора текста",
	chkAnimate: "Разрешить анимацию",
	chkSaveBackups: "Сохранять резервную копию файла при сохранении изменений",
	chkAutoSave: "Авто-сохранение изменений",
	chkGenerateAnRssFeed: "Генерировать данные RSS-канала при сохранении изменений",
	chkSaveEmptyTemplate: "Гененрировать пустой шаблон при сохранении изменений",
	chkOpenInNewWindow: "Открывать внешние ссылки в новом окне",
	chkToggleLinks: "Нажимая на ссылку для открытия записи указывать причины её закрытия (Не понял как правильно перевести)",
	chkHttpReadOnly: "Запрещать редактирование при доступе через HTTP",
	chkForceMinorUpdate: "не обновлять имя пользователя и дату при изменении записи",
	chkConfirmDelete: "Выдавать запрос на подтверждение перед удалением записи",
	chkInsertTabs: "Использовать клавишу tab для вставки символа табуляции вместо перехода между полями",
	txtBackupFolder: "Каталог для сохранения резервных копий",
	txtMaxEditRows: "Максимальное количество строк в полях редактирования",
    txtTheme: "Имя использованной темы",
	txtFileSystemCharSet: "Кодировка по умолчанию (только для Firefox/Mozilla)"});

merge(config.messages,{
	customConfigError: "Появились проблемы при загрузке плагинов. Смотрите раздел PluginManager для более подробных сведений",
	pluginError: "Ошибка: %0",
	pluginDisabled: "Дополнение не будет выполняться потому как установлена метка 'systemConfigDisable'",
	pluginForced: "Дополнение будет выполняться принудительно потому как установлена метка 'systemConfigForce'",
	pluginVersionError: "Дополнение не будет выполняться так как требует другой версии TiddlyWiki",
	nothingSelected: "Ничего не выделено. Сначала вы должны выделить одно или несколько значений",
	savedSnapshotError: "Похоже, что TiddlyWiki был сохранен некорректно. Смотрите http://www.tiddlywiki.com/#DownloadSoftware для более подробных сведений",
	subtitleUnknown: "(неизвестно)",
	undefinedTiddlerToolTip: "Запись '%0' не существует",
	shadowedTiddlerToolTip: "Запись '%0' не существует, но имеет предопределённое скрытое значение",
	tiddlerLinkTooltip: "%0 - %1, %2",
	externalLinkTooltip: "Внешняя ссылка на %0",
	noTags: "Нет записей с подобной меткой",
	notFileUrlError: "Вы должны записать текущую TiddlyWiki в файл перед сохранением изменений",
	cantSaveError: "Невозможно сохранить изменения. Возможные причины:\n- Ваш браузер не поддерживает сохранения (В Firefox, Internet Explorer, Safari и в Opera есть поддержка сохранения)\n- Путь к вашему файлу TiddlyWiki содержит недопустимые символы\n- HTML файл TiddlyWiki был перемещён или переименован",
	invalidFileError: "Файл '%0' не является стандартным TiddlyWiki файлом",
	backupSaved: "Резервная копия сохранена",
	backupFailed: "Ошибка сохранения резервной копии",
	rssSaved: "Файл RSS-канала сохранён",
	rssFailed: "Ошибка сохранения файла с RSS каналом",
	emptySaved: "Пустой шаблон сохранён",
	emptyFailed: "Ошибка сохранения пустого шаблона",
	mainSaved: "Основной файл TiddlyWiki сохранён",
	mainFailed: "Ошибка сохранения основного файла TiddlyWiki. Ваши изменения не будут сохранены",
	macroError: "Ошибка в макросе <<\%0>>",
	macroErrorDetails: "ошибка исполнения макроса <<\%0>>:\n%1",
	missingMacro: "Нет подобного макроса",
	overwriteWarning: "Запись с именем '%0' уже существует. Нажмите OK для её замены",
	unsavedChangesWarning: "ВНИМАНИЕ! Существуют несохранённые изменения в TiddlyWiki\n\nНажмите OK для сохранения\nНажмите CANCEL для отмены",
	confirmExit: "--------------------------------\n\nСуществуют несохранённые изменения в TiddlyWiki. При продолжении будут потеряны все несохранённые изменения\n\n--------------------------------",
	saveInstructions: "СохранитьИзменения",
	unsupportedTWFormat: "Формат '%0' не поддерживается TiddlyWiki",
	tiddlerSaveError: "Ошибка сохранения записи '%0'",
	tiddlerLoadError: "Ошибка загрузки записи '%0'",
	wrongSaveFormat: "Не удаётся сохранить в формате '%0'. Используйте стандартный формат для сохранения.",
	invalidFieldName: "Неверное значение в поле %0",
	fieldCannotBeChanged: "Поле '%0' не может быть изменено",
	loadingMissingTiddler: "Пытаюсь получить запись '%0' с сервера '%1':\n\n'%2' в рабочей области '%3'",
	upgradeDone: "Обновление до версии %0 завершено\n\nНажмите 'OK' для загрузки обновлённой версии TiddlyWiki"});

merge(config.messages.messageClose,{
	text: "закрыть",
	tooltip: "закрыть данную информационную область"});

config.messages.backstage = {
	open: {text: "дополнительно", tooltip: "Открыть дополнительную область редактирования"},
	close: {text: "скрыть", tooltip: "Закрыть дополнительную область"},
	prompt: "дополнительно: ",
	decal: {
		edit: {text: "редактировать", tooltip: "Редактировать запись '%0'"}
	}
};

config.messages.listView = {
	tiddlerTooltip: "Нажмите для простотра записи целиком",
	previewUnavailable: "(предпросмотр не поддерживается)"
};

config.messages.dates.months = ["Январь", "Февраль", "Март", "Апрель", "Мая", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь","Декабрь"];
config.messages.dates.days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
config.messages.dates.shortMonths = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
config.messages.dates.shortDays = ["Вск", "Пон", "Втр", "Срд", "Чтв", "Птн", "Сбт"];
// suffixes for dates, eg "1st","2nd","3rd"..."30th","31st"
config.messages.dates.daySuffixes = ["ое","ое","ье","ое","ое","ое","ое","ое","ое","ое",
		"ое","ое","ое","ое","ое","ое","ое","ое","ое","ое",
		"ое","ое","ье","ое","ое","ое","ое","ое","ое","ое",
		"st"];
config.messages.dates.am = "ут";
config.messages.dates.pm = "вч";

merge(config.messages.tiddlerPopup,{
	});

merge(config.views.wikified.tag,{
	labelNoTags: "нет меток",
	labelTags: "метки: ",
	openTag: "Открыть метку '%0'",
	tooltip: "Показать записи помеченные как '%0'",
	openAllText: "Открыть всё",
	openAllTooltip: "Открыть все эти записи",
	popupNone: "Нет записей с меткой '%0'"});

merge(config.views.wikified,{
	defaultText: "Запись '%0' не существует. Щёлкните два раза для её создания",
	defaultModifier: "(потеряно)",
	shadowModifier: "(создание скрытой записи)",
	dateFormat: "DD MMM YYYY", // use this to change the date format for your locale, eg "YYYY MMM DD", do not translate the Y, M or D
	createdPrompt: "создано"});

merge(config.views.editor,{
	tagPrompt: "Введите метки, разделяя их пробелами, [[используя такие кавычки]] при необходимости, или добавьте существующие",
	defaultText: "Введите текст для '%0'"});

merge(config.views.editor.tagChooser,{
	text: "метки",
	tooltip: "Выбрать существующие метки, для добавления к текущей записи",
	popupNone: "Нет определённых меток",
	tagTooltip: "Добавить метку '%0'"});

merge(config.messages,{
	sizeTemplates:
		[
		{unit: 1024*1024*1024, template: "%0\u00a0GB"},
		{unit: 1024*1024, template: "%0\u00a0MB"},
		{unit: 1024, template: "%0\u00a0KB"},
		{unit: 1, template: "%0\u00a0B"}
		]});

merge(config.macros.search,{
	label: "поиск",
	prompt: "Поиск в текущей TiddlyWiki",
	accessKey: "F",
	successMsg: "%0 записи соответсвуют %1",
	failureMsg: "Нет записей соответсвующих %0"});

merge(config.macros.tagging,{
	label: "помечено: ",
	labelNotTag: "нет меток",
	tooltip: "Список записей с меткой '%0'"});

merge(config.macros.timeline,{
	dateFormat: "DD MMM YYYY"});// use this to change the date format for your locale, eg "YYYY MMM DD", do not translate the Y, M or D

merge(config.macros.allTags,{
	tooltip: "Показать записи с меткой '%0'",
	noTags: "Нет помеченных записей"});

config.macros.list.all.prompt = "Все записи в алфавитном порядке";
config.macros.list.missing.prompt = "Записи на которые ссылаются другие записи, но они не были определены";
config.macros.list.orphans.prompt = "Записи на которые не ссылаются другие записи";
config.macros.list.shadowed.prompt = "Скрытые записи с содержимым по умолчанию";
config.macros.list.touched.prompt = "Записи, изменённые локально";

merge(config.macros.closeAll,{
	label: "закрыть всё",
	prompt: "Закрыть все отображающиеся записи (исключая редактируемые в данный момент)"});

merge(config.macros.permaview,{
	label: "прямая ссылка",
	prompt: "URL-ссылка. отображающая все открытые в данный момент записи"});

merge(config.macros.saveChanges,{
	label: "сохранить изменения",
	prompt: "Сохранить все записи для создания новой TiddlyWiki",
	accessKey: "S"});

merge(config.macros.newTiddler,{
	label: "новая запись",
	prompt: "Создать новую запись",
	title: "Новая запись",
	accessKey: "N"});

merge(config.macros.newJournal,{
	label: "новая запись в журнале",
	prompt: "Создать новую запись с использованием текущих даты и времени",
	accessKey: "J"});

merge(config.macros.options,{
	wizardTitle: "Настроить расширенные опции",
	step1Title: "Данные опции будут сохранены в cookies вашего браузера",
	step1Html: "<input type='hidden' name='markList'></input><br><input type='checkbox' checked='false' name='chkUnknown'>Показать неизвестные опции</input>",
	unknownDescription: "//(неизвестно)//",
	listViewTemplate: {
		columns: [
			{name: 'Option', field: 'option', title: "Опция", type: 'String'},
			{name: 'Description', field: 'description', title: "Описание", type: 'WikiText'},
			{name: 'Name', field: 'name', title: "Имя", type: 'String'}
			],
		rowClasses: [
			{className: 'lowlight', field: 'lowlight'}
			]}
	});

merge(config.macros.plugins,{
	wizardTitle: "Управление дополнениями",
	step1Title: "Загруженные сейчас дополнения",
	step1Html: "<input type='hidden' name='markList'></input>", // DO NOT TRANSLATE
	skippedText: "(данное дополнение не может быть выполненым, так как было добавлено после запуска)",
	noPluginText: "нет установленных дополнений",
	confirmDeleteText: "Подтвердите удаление следующие дополнения:\n\n%0",
	removeLabel: "удалить метку systemConfig",
	removePrompt: "Удалить метку systemConfig",
	deleteLabel: "удалить",
	deletePrompt: "Удалить эти записи навсегда",
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
			{name: 'Tiddler', field: 'tiddler', title: "Tiddler", type: 'Tiddler'},
			{name: 'Description', field: 'Description', title: "Description", type: 'String'},
			{name: 'Version', field: 'Version', title: "Version", type: 'String'},
			{name: 'Size', field: 'size', tiddlerLink: 'size', title: "Size", type: 'Size'},
			{name: 'Forced', field: 'forced', title: "Forced", tag: 'systemConfigForce', type: 'TagCheckbox'},
			{name: 'Disabled', field: 'disabled', title: "Disabled", tag: 'systemConfigDisable', type: 'TagCheckbox'},
			{name: 'Executed', field: 'executed', title: "Loaded", type: 'Boolean', trueText: "Yes", falseText: "No"},
			{name: 'Startup Time', field: 'startupTime', title: "Startup Time", type: 'String'},
			{name: 'Error', field: 'error', title: "Status", type: 'Boolean', trueText: "Error", falseText: "OK"},
			{name: 'Log', field: 'log', title: "Log", type: 'StringList'}
			],
		rowClasses: [
			{className: 'error', field: 'error'},
			{className: 'warning', field: 'warning'}
			]}
	});

merge(config.macros.toolbar,{
	moreLabel: "больше",
	morePrompt: "Показать больше команд",
    lessLabel: "меньшеs",
	lessPrompt: "Спрятать дополнительные команды",
	separator: "|"
	});

merge(config.macros.refreshDisplay,{
	label: "обновить",
	prompt: "Обновить всю TiddlyWiki"
	});

merge(config.macros.importTiddlers,{
	readOnlyWarning: "Запрещн импорт в файл TiddlyWiki доступный только для чтения. Попробуйте открыть файл через протокол file://",
	wizardTitle: "Импорт записей из другого файла или сервера",
	step1Title: "Шаг 1: Укажите сервер или файл TiddlyWiki",
	step1Html: "Укажите тип сервера: <select name='selTypes'><option value=''>Выбор...</option></select><br>Введите URL или путь здесь: <input type='text' size=50 name='txtPath'><br>...или выберите файл: <input type='file' size=50 name='txtBrowse'><br><hr>...или выберите предопределённый канал: <select name='selFeeds'><option value=''>Выбор...</option></select>",
	openLabel: "открыть",
	openPrompt: "Открыть соединение с данным файлом или сервером",
	openError: "Произошли проблемы при открытии tiddlywiki файла",
	statusOpenHost: "Открываем хост",
	statusGetWorkspaceList: "Получаем список доступных рабочих областей",
	step2Title: "Шаг 2: Выбор рабочих областей",
	step2Html: "Введите имя рабочей области: <input type='text' size=50 name='txtWorkspace'><br>...или выберите рабочую область: <select name='selWorkspace'><option value=''>Выбор...</option></select>",
	cancelLabel: "отмена",
	cancelPrompt: "Отмена импорта",
	statusOpenWorkspace: "Открываем рабочую область",
	statusGetTiddlerList: "Получаем список доступных записей",
	errorGettingTiddlerList: "Ошибка при получении списка доступных записей, нажмите Отмена для повторной попытки",
	step3Title: "Шаг 3: Выберите записи для импорта",
	step3Html: "<input type='hidden' name='markList'></input><br><input type='checkbox' checked='true' name='chkSync'>Сохранить связь данных записей с этим сервером, для последующей синхронизации</input><br><input type='checkbox' name='chkSave'>Сохранить информацию об этом сервере в записи 'systemServer' вызовом:</input> <input type='text' size=25 name='txtSaveTiddler'>",
	importLabel: "импорт",
	importPrompt: "Импорт выбранных записей",
	confirmOverwriteText: "Поддтвердите перезапись следующих записей:\n\n%0",
	step4Title: "Шаг 4: Импорт записи %0",
	step4Html: "<input type='hidden' name='markReport'></input>", // DO NOT TRANSLATE
	doneLabel: "готово",
	donePrompt: "Закрыть мастер",
	statusDoingImport: "Импорт записей",
	statusDoneImport: "Все записи импортированы",
	systemServerNamePattern: "%2 на %1",
	systemServerNamePatternNoWorkspace: "%1",
	confirmOverwriteSaveTiddler: "Запись '%0' уже существует. Нажмите 'OK' для перезаписи её вместе с информаций об этом сервере, или 'Отмена' для выхода без сохранения изменений",
	serverSaveTemplate: "|''Тип:''|%0|\n|''URL:''|%1|\n|''Рабочай область:''|%2|\n\nДанная запись создана автоматически, для сохранения информации о сервере",
	serverSaveModifier: "(Система)",
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
			{name: 'Tiddler', field: 'tiddler', title: "Запись", type: 'Tiddler'},
			{name: 'Size', field: 'size', tiddlerLink: 'size', title: "Размер", type: 'Size'},
			{name: 'Tags', field: 'tags', title: "Метки", type: 'Tags'}
			],
		rowClasses: [
			]}
	});

merge(config.macros.upgrade,{
	wizardTitle: "Обновить основной код TiddlyWiki",
	step1Title: "Обновить или восстановить TiddlyWiki до последнего выпуска",
	step1Html: "Вы собираетесь обновить основной код TiddlyWiki до последнего выпуска (из <a href='%0' class='externalLink' target='_blank'>%1</a>). Ваши данные будут сохранены при обновлении<br><br>Заметим, что при обновлении основного кода будут учтены установленные прежде дополнения. Если у Вас появились проблемы с обновлённым файлом, смотрите <a href='http://www.tiddlywiki.org/wiki/CoreUpgrades' class='externalLink' target='_blank'>http://www.tiddlywiki.org/wiki/CoreUpgrades</a>",
	errorCantUpgrade: "Невозможно обновить текущую TiddlyWiki. Вы мождете обновить только TiddlyWiki файлы которых хранятся у вас локально",
	errorNotSaved: "Вы должны сохранить все изменения перед обновлением",
	step2Title: "Подтверждение подробностей обновления",
	step2Html_downgrade: "Вы желаете понизить версию TiddlyWiki до %0 с %1.<br><br>Снижение версии основного кода не рекомендуется",
	step2Html_restore: "Данная TiddlyWiki уже использует последнюю версию основного кода (%0).<br><br>Тем не менее вы можете продолжить обновление, для обеспечения того, чтобы основной код не был повреждён",
	step2Html_upgrade: "Вы желаете обновить TiddlyWiki до версии %0 с %1",
	upgradeLabel: "обновить",
	upgradePrompt: "Подготовка к процессу обновления",
	statusPreparingBackup: "Подготовка к созданию резервной копии",
	statusSavingBackup: "Сохранение файла резервной копии",
	errorSavingBackup: "Появились проблемы при сохранении файл с резервной копией",
	statusLoadingCore: "загрузка основного кода",
	errorLoadingCore: "Ошибка загрузки основного кода",
	errorCoreFormat: "Ошибка в обновлённом основном коде",
	statusSavingCore: "Сохранение обновленного основного кода",
	statusReloadingCore: "Перезагрузка обновленного основного кода",
	startLabel: "старт",
	startPrompt: "Начать процесс обновления",
	cancelLabel: "отмена",
	cancelPrompt: "Отмена обновления",
	step3Title: "Обновление отменено",
	step3Html: "Вы отменили обновление программы"
	});

merge(config.macros.sync,{
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'selected', rowName: 'title', type: 'Selector'},
			{name: 'Tiddler', field: 'tiddler', title: "Запись", type: 'Tiddler'},
			{name: 'Server Type', field: 'serverType', title: "Тип сервера", type: 'String'},
			{name: 'Server Host', field: 'serverHost', title: "Имя сервера", type: 'String'},
			{name: 'Server Workspace', field: 'serverWorkspace', title: "Рабочая область сервера", type: 'String'},
			{name: 'Status', field: 'status', title: "Статус синхронизации", type: 'String'},
			{name: 'Server URL', field: 'serverUrl', title: "URL сервера", text: "Вид", type: 'Link'}
			],
		rowClasses: [
			],
		buttons: [
			{caption: "Синхронизировать выбранные записи", name: 'sync'}
			]},
	wizardTitle: "Синхронизация с внешними серверами и файлами",
	step1Title: "Выберите записи, которые вы желаете синхронизировать",
	step1Html: "<input type='hidden' name='markList'></input>", // DO NOT TRANSLATE
	syncLabel: "синхронизировать",
	syncPrompt: "Синхронизировать выбранные записи",
	hasChanged: "Изменено локально",
	hasNotChanged: "Без изменения локально",
	syncStatusList: {
		none: {text: "...", color: "прозрачность", display:null},
		changedServer: {text: "Изменения на сервере", color: '#8080ff', display:null},
		changedLocally: {text: "Изменено локально", color: '#80ff80', display:null},
		changedBoth: {text: "Изменено локально и на сервере", color: '#ff8080', display:null},
		notFound: {text: "Сервер не найден", color: '#ffff80', display:null},
		putToServer: {text: "Обновлённая версия сохранена на сервере", color: '#ff80ff', display:null},
		gotFromServer: {text: "Получение обновления с сервера", color: '#80ffff', display:null}
		}
	});

merge(config.commands.closeTiddler,{
	text: "закрыть",
	tooltip: "Закрыть данную запись"});

merge(config.commands.closeOthers,{
	text: "закрыть остальные",
	tooltip: "Закрыть все записи кроме данной"});

merge(config.commands.editTiddler,{
	text: "редактировать",
	tooltip: "Редактировать запись",
	readOnlyText: "вид",
	readOnlyTooltip: "Просмотреть исходник записи"});

merge(config.commands.saveTiddler,{
	text: "готово",
	tooltip: "Сохранить запись"});

merge(config.commands.cancelTiddler,{
	text: "отмена",
	tooltip: "отменить все изменения записи",
	warning: "Вы действительно хотите отказаться от изменения '%0'?",
	readOnlyText: "готово",
	readOnlyTooltip: "Просмотр записи в нормальном режиме"});

merge(config.commands.deleteTiddler,{
	text: "удалить",
	tooltip: "Удалить текущую запись",
	warning: "Вы действительно желаете удалить запись '%0'?"});

merge(config.commands.permalink,{
	text: "прямая ссылка",
	tooltip: "Прямая ссылка на данную запись"});

merge(config.commands.references,{
	text: "ссылки",
	tooltip: "Показать записи ссылающиеся на данную",
	popupNone: "Нет ссылок"});

merge(config.commands.jump,{
	text: "переход",
	tooltip: "Перейти к другой открытой записи"});

merge(config.commands.syncing,{
	text: "синхронизация",
	tooltip: "Контролировать синхронизацию данной записи с внешними серверами и записями",
	currentlySyncing: "<div>В настоящее время синхронизировано с <span class='popupHighlight'>'%0'</span> to:</"+"div><div>host: <span class='popupHighlight'>%1</span></"+"div><div>рабочая область: <span class='popupHighlight'>%2</span></"+"div>", // Note escaping of closing <div> tag
	notCurrentlySyncing: "Не синхронизировано в настоящее время",
	captionUnSync: "Отсавноить синхронизацию данной записи",
	chooseServer: "Синхронизировать данную запись с другим сервером:",
	currServerMarker: "\u25cf ",
	notCurrServerMarker: "  "});

merge(config.commands.fields,{
	text: "поля",
	tooltip: "Показать дополнительные поля данной записи",
	emptyText: "нет расширенных полей для данной записи",
	listViewTemplate: {
		columns: [
			{name: 'Field', field: 'field', title: "Поле", type: 'String'},
			{name: 'Value', field: 'value', title: "Значение", type: 'String'}
			],
		rowClasses: [
			],
		buttons: [
			]}});

merge(config.shadowTiddlers,{
	DefaultTiddlers: "[[СчегоНачать]]",
	MainMenu: "[[СчегоНачать]]\n\n\n^^~TiddlyWiki версия <<version>>\n© 2009 [[UnaMesa|http://www.unamesa.org/]]^^",
	СчегоНачать: "Чтобы начать работу с пустой TiddlyWiki, вы должны изменить некоторые записи:\n* SiteTitle & SiteSubtitle: Заголовок и подзаголовок сайта, как показано выше (после сохранения они также будут показаны в заголовке сайта)\n* MainMenu: Главное меню (Обычно расположено слева)\n* DefaultTiddlers: Записи которые вы бы хотели видеть при запуске TiddlyWiki\nВы должны ввести ваше имя для обозначения автора записей: <<option txtUserName>>",
	SiteTitle: "Моя TiddlyWiki",
	SiteSubtitle: "нелинейный персональный WEB-блокнот",
	SiteUrl: "http://www.tiddlywiki.com/",
	OptionsPanel: "Данный интерфейс посзволяет изменять настройки TiddlyWiki сохраняемые в вашем браузере\n\nВашим именем будут подписаны ваши записи. Запишите его, как в WikiWord (например JoeBloggs)\n<<option txtUserName>>\n\n<<option chkSaveBackups>> Сохранять резервные копии\n<<option chkAutoSave>> Авто сохранение\n<<option chkRegExpSearch>> Поиск с использованием регулярных выражений\n<<option chkCaseSensitiveSearch>> Поиск с учётом регистра\n<<option chkAnimate>> Разрешить анимацию\n\n----\nСмотрите также [[расширенные опиции|AdvancedOptions]]",
	SideBarOptions: '<<search>><<closeAll>><<permaview>><<newTiddler>><<newJournal "DD MMM YYYY" "журнал">><<saveChanges>><<slider chkSliderOptionsPanel OptionsPanel "опции \u00bb" "Изменить расширенные опции TiddlyWiki">>',
	SideBarTabs: '<<tabs txtMainTab "Хронология" "Хронология" TabTimeline "Все" "Все записи" TabAll "Метки" "Все метки" TabTags "Ещё" "Ещё списки" TabMore>>',
	TabMore: '<<tabs txtMoreTab "Потерянные" "Потерянные записи" TabMoreMissing "Сироты" "Осиротевшие записи" TabMoreOrphans "Скрытые" "Скрытые записи" TabMoreShadowed>>'
	});

merge(config.annotations,{
	AdvancedOptions: "Данная запись предоставляет доступ к расширенным настройкам",
	ColorPalette: "Изменяя значения данной записи вы сможете изменять цветовую схему оформления ~TiddlyWiki",
	DefaultTiddlers: "Записи перечисленные здесь автоматически показываются при запуске ~TiddlyWiki",
	EditTemplate: "HTML шаблон в этой записи определяет как будут выглядеть записи при их редактировании",
	GettingStarted: "Здесь перечислены базовые инструкции по использованию программы",
	ImportTiddlers: "Используя эту запись вы сможете импортировать другие записи",
	MainMenu: "Здесь перечислено содержимое главного меню, отображаемого слева на экране",
	MarkupPreHead: "Эта запись будет вставлена в вершину секции <head> HTML файла TiddlyWiki",
	MarkupPostHead: "Эта запись будет вставлена снизу секции <head> HTML файла TiddlyWiki",
	MarkupPreBody: "Эта запись будет вставлена в вершину секции <body> HTML файла TiddlyWiki",
	MarkupPostBody: "Эта запись будет вставлена снизу секции <body> HTML файла TiddlyWiki после бюлока скриптов",
	OptionsPanel: "Здесь определно содержимое выпадающей справа панели настроек",
	PageTemplate: "HTML шаблон внутри этой записи определяет общий макет ~TiddlyWiki",
	PluginManager: "Доступ к панели управления дополнениями",
	SideBarOptions: "Позволяет отредактировать содержимое панели опций справа",
	SideBarTabs: "Содержимое панели закладок справа",
	SiteSubtitle: "Содержимое подзаголовка сайта",
	SiteTitle: "Содержимое заголовка сайта",
	SiteUrl: "URL сайта для публикации",
	StyleSheetColors: "Содержимое CSS определяющий цвета элементов страницы. ''НЕ РЕДАКТИРУЙТЕ ЭТУ ЗАПИСЬ'', вносите свои изменения в скрытую запись StyleSheet",
	StyleSheet: "Эта запись определяет пользователский CSS",
	StyleSheetLayout: "Соджержит CSS определяющий расположение элементов на странице. ''НЕ РЕДАКТИРУЙТЕ ЭТУ ЗАПИСЬ'', вносите свои изменения в скрытую запись StyleSheet",
	StyleSheetLocale: "Содержит CSS определяющий особенности первода",
	StyleSheetPrint: "Содержит CSS определяющий парааметры печати",
	TabAll: "Содержимое вкладки 'Всё' на правой на правой боковй панели",
	TabMore: "Содержимое вкладки 'Ещё' на правой на правой боковй панели",
	TabMoreMissing: "Содержимое вкладки 'Потерянные' на правой на правой боковй панели",
	TabMoreOrphans: "Содержимое вкладки 'Сироты' на правой на правой боковй панели",
	TabMoreShadowed: "Содержимое вкладки 'Скрытые' на правой на правой боковй панели",
	TabTags: "Содержимое вкладки 'Метки' на правой на правой боковй панели",
	TabTimeline: "Содержимое вкладки 'Хронология' на правой на правой боковй панели",
	ToolbarCommands: "Определяет команды панели инструментов",
	ViewTemplate: "HTML шаблон в этой записи определяет как будут отображаться записи"
	});

//}}}
