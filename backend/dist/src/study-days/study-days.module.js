"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyDaysModule = void 0;
const common_1 = require("@nestjs/common");
const study_days_service_1 = require("./study-days.service");
const study_days_controller_1 = require("./study-days.controller");
let StudyDaysModule = class StudyDaysModule {
};
exports.StudyDaysModule = StudyDaysModule;
exports.StudyDaysModule = StudyDaysModule = __decorate([
    (0, common_1.Module)({
        controllers: [study_days_controller_1.StudyDaysController],
        providers: [study_days_service_1.StudyDaysService],
        exports: [study_days_service_1.StudyDaysService],
    })
], StudyDaysModule);
//# sourceMappingURL=study-days.module.js.map