# Автообновление Apps Script (Code.gs v62+)

После разовой настройки скрипт сам обновляется после каждой выкладки
`apps-script/Code.gs` в ветку `main`. GitHub Actions (`.github/workflows/apps-script-update.yml`)
вызывает `…/exec?action=selfUpdate&sha=<коммит>`. Скрипт забирает файл этого коммита,
подменяет свой файл `Code`, создаёт версию и переводит на неё текущее развертывание.
Адрес веб-приложения не меняется.

Страховки:
- кнопка «Обновить сервер» в панели администратора;
- проверка раз в час (триггер `autoUpdateHourly`).

Журнал ведётся на листе «Обновления скрипта».

**Важно:** правки, сделанные прямо в редакторе Apps Script, следующее обновление
перезапишет. Единственный источник кода — этот репозиторий.

## Разовая настройка

Лучше делать с компьютера.

1. Включите «Google Apps Script API»: https://script.google.com/home/usersettings.
2. В редакторе скрипта откройте «Настройки проекта» (шестерёнка) и включите
   «Показывать файл манифеста appsscript.json в редакторе».
3. Откройте `appsscript.json`. Сразу после первой `{` вставьте блок ниже,
   остальное не трогайте. Проверьте, что в файле есть раздел `"webapp"`
   (`"executeAs": "USER_DEPLOYING"`, `"access": "ANYONE_ANONYMOUS"`).

```json
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.scriptapp",
    "https://www.googleapis.com/auth/script.send_mail",
    "https://www.googleapis.com/auth/script.container.ui",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/script.projects",
    "https://www.googleapis.com/auth/script.deployments"
  ],
```

4. Замените содержимое `Code.gs` на v62 и сохраните.
5. Выберите функцию `setupAutoUpdate`, нажмите «Выполнить» и разрешите доступ.
   В журнале выполнения должно появиться «Готово: автообновление включено».
6. Последний раз вручную: «Начать развертывание» → «Управление развертываниями» →
   карандаш у текущего развертывания → «Новая версия» → «Развернуть».
