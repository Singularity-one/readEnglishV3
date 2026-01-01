import { defineStore } from 'pinia';

export const useExcelStore = defineStore('excel', {
  state: () => ({
    headers: [],
    tableData: [],
    wordExplanations: {},
    wordTranslations: {},
    wordExamples: {},
    wordPartsOfSpeech: {},
    wordOneDay: {},
    wordTwoDay: {},
    wordThreeDay: {},
    wordOneWeek: {},
    wordTwoWeek: {},
    wordOneMoon: {},
    wordCloze: {},
  }),
  actions: {
    setExcelData(headers, tableData) {
      this.headers = headers;
      this.tableData = tableData;

      this.parseTableDataToDicts(tableData);
    },
    parseTableDataToDicts(tableData) {
      const explanations = {};
      const translations = {};
      const examples = {};
      const partsOfSpeech = {};

      const oneDays = {};
      const twoDays = {};
      const threeDays = {};
      const oneWeeks = {};
      const twoWeeks = {};
      const oneMoons = {};
      const clozes = {};


      tableData.forEach(row => {
        // 把欄位名轉小寫，避免大小寫不一致
        const rowLower = {};
        for (const key in row) {
          if (Object.hasOwnProperty.call(row, key)) {
            rowLower[key.toLowerCase()] = row[key];
          }
        }

        const word = (rowLower['word'] || '').toString().toLowerCase().trim();
        if (word) {
          explanations[word] = (rowLower['explanation'] || '').toString().trim();
          translations[word] = (rowLower['translation'] || '').toString().trim();
          examples[word] = (rowLower['example'] || '').toString().trim();
          partsOfSpeech[word] = (rowLower['partofspeech'] || '').toString().trim();

          oneDays[word] = (rowLower['oneDay'] || '').toString().trim();
          twoDays[word] = (rowLower['twoDay'] || '').toString().trim();
          threeDays[word] = (rowLower['threeDay'] || '').toString().trim();
          oneWeeks[word] = (rowLower['oneWeek'] || '').toString().trim();
          twoWeeks[word] = (rowLower['twoWeek'] || '').toString().trim();
          oneMoons[word] = (rowLower['oneMoon'] || '').toString().trim();
          clozes[word] = (rowLower['cloze'] || '').toString().trim();

        }
      });

      this.wordExplanations = explanations;
      this.wordTranslations = translations;
      this.wordExamples = examples;
      this.wordPartsOfSpeech = partsOfSpeech;


      this.wordOneDay = oneDays;
      this.wordTwoDay = twoDays;
      this.wordThreeDay = threeDays;
      this.wordOneWeek = oneWeeks;
      this.wordTwoWeek = twoWeeks;
      this.wordOneMoon = oneMoons;
      this.wordCloze = clozes;
    }
  }
});
