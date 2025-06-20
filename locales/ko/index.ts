export const ko = {
  common: {
    app: {
      title: '할 일 목록',
      newTask: '새 작업',
      tasks: '작업',
      activeTasks: '{{count}}개의 활성 작업',
      completedTasks: '{{count}}개의 완료된 작업',
      activeTaskTitle: '활성 작업',
      completedTaskTitle: '완료된 작업 ({{count}})',
      emptyText: '사용 가능한 작업이 없습니다. "새 작업"을 클릭하여 생성하세요.',
    },
    task: {
      task: '작업',
      addTask: '작업 추가',
      editTask: '작업 편집',
      updateTask: '작업 업데이트',
      taskDescription: '작업 설명 입력',
      extraDetails: '추가 세부사항 입력',
      priority: '우선순위',
      category: '카테고리',
      dueDate: '마감일',
      pickDate: '날짜 선택',
      noPriority: '우선순위 없음',
      noCategory: '카테고리 없음',
      priorities: {
        high: '높음',
        medium: '보통',
        low: '낮음',
      },
      extraDetailsTitle: '추가 세부사항',
      today: '오늘',
      tomorrow: '내일',
      highPriority: '높은 우선순위',
      mediumPriority: '보통 우선순위',
      lowPriority: '낮은 우선순위',
      completed: '완료됨',
      active: '활성',
    },
    category: {
      manageCategories: '카테고리 관리',
      addNewCategory: '새 카테고리 추가',
      categoryName: '카테고리 이름',
      existingCategories: '기존 카테고리',
      default: '기본값',
    },
    actions: {
      add: '추가',
      cancel: '취소',
      delete: '삭제',
      edit: '편집',
      save: '저장',
      close: '닫기',
      done: '완료',
      tryAgain: '다시 시도',
    },
    export: {
      exportData: '데이터 내보내기',
      jsonFormat: 'JSON 형식',
      csvFormat: 'CSV 형식',
      instructions: '작업과 카테고리를 내보낼 형식을 선택하세요.',
      completeBackup: '모든 작업 세부사항이 포함된 완전한 백업',
      spreadsheetCompatible: '분석용 스프레드시트 호환',
    },
    import: {
      importData: '데이터 가져오기',
      instructions: '이전에 내보낸 JSON 파일에서 작업과 카테고리를 가져옵니다.',
      processing: '처리 중...',
      selectFile: 'JSON 파일을 여기에 끌어놓거나 클릭하여 찾아보기',
      supportDetails: '할 일 목록 내보내기 파일 지원 (버전 1.0.0 이상)',
      importOptions: '가져오기 옵션',
      checkboxLabel: '가져온 항목에 새 ID 생성',
      importItem1a: '모든 항목이 새 ID를 받습니다 (안전, 충돌 없음)',
      importItem1b: '항목이 원래 ID를 유지합니다 (같은 ID의 기존 항목을 덮어씀)',
      importItem2a: '카테고리가 작업과 함께 가져와집니다',
      importItem2b: '카테고리가 ID로 병합되거나 새로운 경우 추가됩니다',
      importItem3a: '기존 데이터는 영향을 받지 않습니다',
      importItem3b: '일치하는 ID가 가져온 데이터로 업데이트됩니다',
      importSuccessful: '가져오기 성공',
      importFailed: '가져오기 실패',
      invalidJsonFile: '유효한 JSON 파일을 선택하세요.',
      parseError: '파일 구문 분석 실패: {{error}}',
      unknownError: '알 수 없는 오류',
      invalidJsonFormat: '유효하지 않은 JSON 형식',
      errors: {
        invalidFormat: '유효하지 않은 파일 형식입니다. JSON 데이터가 예상됩니다.',
        missingVersion: '가져오기 파일에 버전 정보가 없습니다.',
        invalidTasks: '유효하지 않거나 누락된 작업 데이터.',
        invalidCategories: '유효하지 않거나 누락된 카테고리 데이터.',
        invalidTaskStructure: '가져오기 데이터의 작업 구조가 유효하지 않습니다.',
        invalidCategoryStructure: '가져오기 데이터의 카테고리 구조가 유효하지 않습니다.',
        unsupportedVersion: '지원되지 않는 버전: {{version}}. 이 파일을 가져오려면 애플리케이션을 업데이트하세요.',
        importError: '가져오기 오류: {{error}}',
      },
      success: {
        validImport: '유효한 가져오기 데이터',
      },
      successMessage: '{{taskCount}}개의 작업과 {{categoryCount}}개의 카테고리를 성공적으로 {{action}}했습니다.',
      actionImported: '가져오기',
      actionImportedUpdated: '가져오기/업데이트',
    },
    deleteMode: {
      tasksSelected: '{{count}}개의 작업이 선택됨',
      deleteSelected: '선택한 항목 삭제',
    },
    about: {
      title: '할 일 목록 정보',
      appName: '할 일 목록',
      description:
        'Electron, React, TypeScript로 구축된 현대적이고 우아한 데스크톱 할 일 애플리케이션입니다. 카테고리, 우선순위, 마감일, 드래그 앤 드롭 기능으로 작업을 정리하세요.',
      version: '버전 {{version}}',
      github: 'GitHub에서 보기',
      discord: 'Discord 참여',
      feedbackTitle: '피드백 및 버그 신고',
      feedbackText: '버그를 발견했거나 기능 요청이 있나요? 가장 빠른 응답을 위해 Discord 커뮤니티에 신고해 주세요.',
      createdBy: '제작자',
    },
  },
  menu: {
    title: '할 일 목록',
    file: '파일',
    newTask: '새 작업',
    language: '언어',
    english: '영어',
    spanish: '스페인어',
    french: '프랑스어',
    german: '독일어',
    portuguese: '포르투갈어',
    japanese: '일본어',
    chinese: '중국어',
    korean: '한국어',
    italian: '이탈리아어',
    dutch: '네덜란드어',
    manageCategories: '카테고리 관리',
    deleteMode: '삭제 모드',
    import: '가져오기',
    importJson: 'JSON 가져오기',
    export: '내보내기',
    exportAsJson: 'JSON으로 내보내기',
    exportAsCsv: 'CSV로 내보내기',
    quit: '종료',
    edit: '편집',
    view: '보기',
    window: '윈도우',
    help: '도움말',
    about: '할 일 목록 정보',
    hide: '할 일 목록 숨기기',
    reload: '새로고침',
    forceReload: '강제 새로고침',
    actualSize: '실제 크기',
    zoomIn: '확대',
    zoomOut: '축소',
    toggleFullscreen: '전체화면 전환',
    developerTools: '개발자 도구',
    minimize: '최소화',
    close: '닫기',
    toggleDarkMode: '다크 모드 전환',
    bringAllToFront: '모두 앞으로 가져오기',
    discordCommunity: 'Discord 커뮤니티',
    githubRepository: 'GitHub 저장소',
    undo: '실행 취소',
    redo: '다시 실행',
    cut: '잘라내기',
    copy: '복사',
    paste: '붙여넣기',
    selectAll: '모두 선택',
  },
}
