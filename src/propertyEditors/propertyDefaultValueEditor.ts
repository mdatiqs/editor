import * as ko from "knockout";
import * as Survey from "survey-knockout";
import { SurveyPropertyModalEditor } from "./propertyModalEditor";
import { SurveyPropertyEditorBase } from "./propertyEditorBase";
import { editorLocalization } from "../editorLocalization";
import { SurveyPropertyEditorFactory } from "./propertyEditorFactory";

export class SurveyPropertyDefaultValueEditor extends SurveyPropertyModalEditor {
  public survey: Survey.Survey;
  public question: Survey.Question;
  koSurvey: any;

  constructor(property: Survey.JsonObjectProperty) {
    super(property);
    this.koSurvey = ko.observable(new Survey.Survey());
  }
  public getValueText(value: any): string {
    if (!value) return editorLocalization.getString("pe.empty");
    return JSON.stringify(value);
  }
  public beforeShowModal() {
    super.beforeShowModal();
    this.createSurvey();
  }
  protected onBeforeApply() {
    if (!this.survey) return;
    this.setValueCore(this.survey.getValue(this.object.name));
  }
  public get editorType(): string {
    return "value";
  }
  private createSurvey() {
    var qjson = new Survey.JsonObject().toJsonObject(this.object);
    qjson.type = this.getJsonType(this.object.getType());
    delete qjson["visible"];
    delete qjson["visibleIf"];
    delete qjson["enable"];
    delete qjson["enableIf"];
    var json = '{ "questions": [' + JSON.stringify(qjson) + "]}";
    this.survey = new Survey.Survey(json);
    this.survey.setValue(this.object.name, this.editingValue);
    this.survey.showNavigationButtons = false;
    this.survey.showQuestionNumbers = "off";
    this.koSurvey(this.survey);
  }
  private getJsonType(type: string): string {
    return type != "expression" ? type : "text";
  }
}
SurveyPropertyEditorFactory.registerEditor("value", function(
  property: Survey.JsonObjectProperty
): SurveyPropertyEditorBase {
  return new SurveyPropertyDefaultValueEditor(property);
});
