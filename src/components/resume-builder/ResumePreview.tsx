"use client";

import { Resume } from "@prisma/client";
import { format, parseISO, differenceInMonths } from "date-fns";
import { uk } from "date-fns/locale";
import { Mail, Phone, MapPin } from "lucide-react";

const formatMonthYearStr = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const formatted = format(parseISO(`${dateStr}-01`), "LLLL yyyy", { locale: uk });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return dateStr;
  }
};

const getExperienceDurationInMonths = (exp: any) => {
  if (!exp.startDate) return 0;
  try {
    const start = parseISO(`${exp.startDate}-01`);
    const end = exp.current || !exp.endDate ? new Date() : parseISO(`${exp.endDate}-01`);
    return Math.max(0, differenceInMonths(end, start) + 1);
  } catch {
    return 0;
  }
};

const formatDurationRu = (months: number) => {
  if (months === 0) return "";
  if (months < 1) return "менше місяця";
  const y = Math.floor(months / 12);
  const m = months % 12;

  const getYearPlural = (v: number) => {
    const v10 = v % 10;
    const v100 = v % 100;
    if (v10 === 1 && v100 !== 11) return "рік";
    if ([2, 3, 4].includes(v10) && ![12, 13, 14].includes(v100)) return "роки";
    return "років";
  };

  const getMonthPlural = (v: number) => {
    const v10 = v % 10;
    const v100 = v % 100;
    if (v10 === 1 && v100 !== 11) return "місяць";
    if ([2, 3, 4].includes(v10) && ![12, 13, 14].includes(v100)) return "місяці";
    return "місяців";
  };

  const parts = [];
  if (y > 0) parts.push(`${y} ${getYearPlural(y)}`);
  if (m > 0) parts.push(`${m} ${getMonthPlural(m)}`);
  return parts.join(" ");
};

function StandardTemplate({ resume, experience, education, skills, languages, fullName, totalExpMonths }: any) {
  return (
    <div className="bg-white text-gray-900 w-full rounded-md shadow-xl overflow-hidden print:shadow-none print:w-[210mm] print:min-h-[297mm] mx-auto box-border font-sans leading-normal" id="resume-preview">
      <div className="p-8 md:p-12 print:p-10">
        <header className="border-b-2 border-gray-200 pb-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">
                {fullName || "Ваше ім'я"}
              </h1>
              <div className="flex flex-col mb-4">
                <div className="text-xl text-blue-700 font-medium">
                  {resume.desiredRole || "Бажана посада"}
                </div>
                {resume.employmentType && (
                  <div className="text-sm font-medium text-gray-500 mt-1">
                    {resume.employmentType}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                {resume.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{resume.location}</span>
                  </div>
                )}
                {resume.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{resume.phone}</span>
                  </div>
                )}
                {resume.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${resume.contactEmail}`} className="hover:text-blue-600 w-fit">
                      {resume.contactEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="md:text-right">
              {resume.salary && (
                <div className="text-lg font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded inline-block">
                  {resume.salary}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          {experience.length > 0 && (
            <section>
              <div className="flex items-center gap-3 border-b border-gray-200 mb-4 pb-2">
                <h2 className="text-lg font-bold text-gray-900 tracking-wide uppercase">
                  Досвід роботи
                </h2>
                {totalExpMonths > 0 && (
                  <span className="text-sm font-medium text-gray-500 lowercase bg-white mt-0.5">
                    {formatDurationRu(totalExpMonths)}
                  </span>
                )}
              </div>
              <div className="space-y-6">
                {experience.map((exp: any, index: number) => {
                  const months = getExperienceDurationInMonths(exp);
                  return (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 break-inside-avoid">
                      <div className="text-sm text-gray-600 mt-0.5">
                        <div className="font-medium whitespace-nowrap">
                          {formatMonthYearStr(exp.startDate)} —
                        </div>
                        <div className="font-medium whitespace-nowrap mb-1 text-gray-800">
                          {exp.current ? "по теперішній час" : formatMonthYearStr(exp.endDate)}
                        </div>
                        {months > 0 && (
                          <div className="text-gray-500 text-xs mt-1">
                            {formatDurationRu(months)}
                          </div>
                        )}
                      </div>
                      <div>
                        {exp.company && (
                          <div className="text-base font-bold text-gray-900 mb-0.5">
                            {exp.company}
                          </div>
                        )}
                        <div className="text-sm font-semibold text-gray-800 mb-2">
                          {exp.position || "Посада"}
                        </div>
                        {exp.description && (
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section className="break-inside-avoid">
              <h2 className="text-lg font-bold border-b border-gray-200 mb-3 text-gray-900 pb-2 tracking-wide uppercase">
                Навички
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold border-b border-gray-200 mb-4 text-gray-900 pb-2 tracking-wide uppercase">
                Освіта
              </h2>
              <div className="space-y-4">
                {education.map((edu: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-40 items-baseline break-inside-avoid">
                    {edu.gradYear && (
                      <span className="text-sm font-medium text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
                        {edu.gradYear}
                      </span>
                    )}
                    <div>
                      <h3 className="text-md font-semibold text-gray-900">
                        {edu.institution || "Навчальний заклад"}
                      </h3>
                      <div className="text-sm text-gray-700">
                        {edu.degree && <span className="font-medium">{edu.degree}</span>}
                        {edu.degree && edu.fieldOfStudy && <span> — </span>}
                        {edu.fieldOfStudy && <span>{edu.fieldOfStudy}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.about && (
            <section>
              <h2 className="text-lg font-bold border-b border-gray-200 mb-3 text-gray-900 pb-2 tracking-wide uppercase">
                Про мене
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {resume.about}
              </p>
            </section>
          )}

          {languages.length > 0 && (
            <section className="break-inside-avoid">
              <h2 className="text-lg font-bold border-b border-gray-200 mb-3 text-gray-900 pb-2 tracking-wide uppercase">
                Мови
              </h2>
              <div className="flex flex-col gap-y-2 gap-x-4">
                {languages.map((lang: any, index: number) => (
                  <div key={index} className="flex w-full max-w-[300px] justify-between items-baseline border-b border-gray-100 pb-1">
                    <span className="font-medium text-gray-800">{lang.name || "Мова"}</span>
                    <span className="text-sm text-gray-600">{lang.level || "Рівень не вказано"}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function ModernTemplate({ resume, experience, education, skills, languages, fullName, totalExpMonths }: any) {
  return (
    <div className="bg-white text-gray-900 w-full rounded-md shadow-xl overflow-hidden print:shadow-none print:w-[210mm] print:min-h-[297mm] mx-auto box-border font-sans leading-normal flex flex-col md:flex-row min-h-screen print:min-h-[297mm]" id="resume-preview">
      
      {/* Left Column */}
      <div className="w-full md:w-[35%] bg-[#f3f4f6] p-8 print:p-8 flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-[#1e3a8a] break-words">
            {fullName || "Ваше ім'я"}
          </h1>
          <div className="flex flex-col mb-6">
            <div className="text-xl text-[#2563eb] font-semibold">
              {resume.desiredRole || "Бажана посада"}
            </div>
            {resume.employmentType && (
              <div className="text-sm font-medium text-gray-500 mt-1">
                {resume.employmentType}
              </div>
            )}
            {resume.salary && (
              <div className="text-sm font-bold text-gray-800 bg-white px-2 py-1 rounded inline-block mt-3 w-fit shadow-sm">
                {resume.salary}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-700">
            {resume.location && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>{resume.location}</span>
              </div>
            )}
            {resume.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span>{resume.phone}</span>
              </div>
            )}
            {resume.contactEmail && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#2563eb]" />
                </div>
                <a href={`mailto:${resume.contactEmail}`} className="hover:text-[#2563eb] break-all">
                  {resume.contactEmail}
                </a>
              </div>
            )}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="break-inside-avoid">
            <h2 className="text-xl font-bold text-[#1e3a8a] uppercase tracking-wider mb-4 border-b-2 border-[#2563eb] pb-2">
              Навички
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-bold bg-[#1e3a8a] text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="break-inside-avoid">
            <h2 className="text-xl font-bold text-[#1e3a8a] uppercase tracking-wider mb-4 border-b-2 border-[#2563eb] pb-2">
              Мови
            </h2>
            <div className="flex flex-col gap-3">
              {languages.map((lang: any, index: number) => (
                <div key={index} className="flex flex-col">
                  <span className="font-bold text-gray-900">{lang.name || "Мова"}</span>
                  <span className="text-sm text-gray-600">{lang.level || "Рівень не вказано"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="w-full md:w-[65%] p-8 md:p-12 print:p-10 flex flex-col gap-8 bg-white">
        {resume.about && (
          <section>
            <h2 className="text-xl font-bold text-[#1e3a8a] uppercase tracking-wider mb-4 border-b-2 border-[#2563eb] pb-2">
              Про мене
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {resume.about}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4 border-b-2 border-[#2563eb] pb-2">
              <h2 className="text-xl font-bold text-[#1e3a8a] uppercase tracking-wider">
                Досвід роботи
              </h2>
              {totalExpMonths > 0 && (
                <span className="text-sm font-medium text-gray-500 lowercase mt-0.5">
                  ({formatDurationRu(totalExpMonths)})
                </span>
              )}
            </div>
            <div className="space-y-6">
              {experience.map((exp: any, index: number) => (
                <div key={index} className="flex flex-col gap-1 break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1 sm:gap-4">
                    {exp.company && (
                      <h3 className="text-lg font-bold text-gray-900">
                        {exp.company}
                      </h3>
                    )}
                    <div className="text-sm text-[#2563eb] font-semibold sm:text-right shrink-0">
                      {formatMonthYearStr(exp.startDate)} — {exp.current ? "по теперішній час" : formatMonthYearStr(exp.endDate)}
                    </div>
                  </div>
                  <div className="text-md font-semibold text-gray-800 mb-2">
                    {exp.position || "Посада"}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#1e3a8a] uppercase tracking-wider mb-4 border-b-2 border-[#2563eb] pb-2">
              Освіта
            </h2>
            <div className="space-y-5">
              {education.map((edu: any, index: number) => (
                <div key={index} className="flex flex-col break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1 sm:gap-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {edu.institution || "Навчальний заклад"}
                    </h3>
                    {edu.gradYear && (
                      <span className="text-sm text-[#2563eb] font-semibold shrink-0">
                        {edu.gradYear}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {edu.degree && <span>{edu.degree}</span>}
                    {edu.degree && edu.fieldOfStudy && <span> — </span>}
                    {edu.fieldOfStudy && <span>{edu.fieldOfStudy}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ElegantTemplate({ resume, experience, education, skills, languages, fullName }: any) {
  return (
    <div className="bg-white text-black w-full rounded-md shadow-xl overflow-hidden print:shadow-none print:w-[210mm] print:min-h-[297mm] mx-auto box-border" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", lineHeight: 1.7 }} id="resume-preview">
      <div className="p-10 md:p-16 print:p-12 flex flex-col gap-10">
        
        <header className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-normal uppercase mb-3 text-black" style={{ letterSpacing: '2px' }}>
            {fullName || "Ваше ім'я"}
          </h1>
          <div className="text-xl md:text-2xl italic text-gray-800 mb-4">
            {resume.desiredRole || "Бажана посада"}
            {resume.employmentType && <span className="text-lg text-gray-600 ml-2">({resume.employmentType})</span>}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-700">
            {resume.location && <span>{resume.location}</span>}
            {resume.phone && <span>{resume.phone}</span>}
            {resume.contactEmail && (
              <a href={`mailto:${resume.contactEmail}`} className="hover:underline">
                {resume.contactEmail}
              </a>
            )}
            {resume.salary && (
              <span>{resume.salary}</span>
            )}
          </div>
        </header>

        <div className="flex flex-col gap-10">
          
          {resume.about && (
            <section>
              <h2 className="text-xl font-normal uppercase text-center mb-4 tracking-widest">
                Про мене
              </h2>
              <hr className="border-t-[0.5px] border-black mb-6 w-full" />
              <p className="text-base text-justify whitespace-pre-wrap">
                {resume.about}
              </p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h2 className="text-xl font-normal uppercase text-center mb-4 tracking-widest">
                Досвід роботи
              </h2>
              <hr className="border-t-[0.5px] border-black mb-6 w-full" />
              <div className="space-y-8">
                {experience.map((exp: any, index: number) => (
                  <div key={index} className="flex flex-col break-inside-avoid">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-1 gap-1 sm:gap-4">
                      <h3 className="text-lg font-bold text-black uppercase tracking-wide">
                        {exp.position || "Посада"}
                      </h3>
                      <div className="text-sm text-gray-800 italic shrink-0">
                        {formatMonthYearStr(exp.startDate)} — {exp.current ? "теперішній час" : formatMonthYearStr(exp.endDate)}
                      </div>
                    </div>
                    <div className="text-base font-semibold text-gray-900 mb-3">
                      {exp.company && <span>{exp.company}</span>}
                    </div>
                    {exp.description && (
                      <p className="text-base text-justify whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xl font-normal uppercase text-center mb-4 tracking-widest">
                Освіта
              </h2>
              <hr className="border-t-[0.5px] border-black mb-6 w-full" />
              <div className="space-y-6">
                {education.map((edu: any, index: number) => (
                  <div key={index} className="flex flex-col break-inside-avoid text-center">
                    <h3 className="text-lg font-bold text-black">
                      {edu.institution || "Навчальний заклад"}
                    </h3>
                    <div className="text-base text-gray-900 italic mt-1">
                      {edu.degree && <span>{edu.degree}</span>}
                      {edu.degree && edu.fieldOfStudy && <span> з напрямку </span>}
                      {edu.fieldOfStudy && <span>{edu.fieldOfStudy}</span>}
                      {edu.gradYear && <span className="ml-2">({edu.gradYear})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section className="break-inside-avoid">
              <h2 className="text-xl font-normal uppercase text-center mb-4 tracking-widest">
                Навички
              </h2>
              <hr className="border-t-[0.5px] border-black mb-6 w-full" />
              <div className="text-center text-base leading-relaxed">
                {skills.join("  •  ")}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section className="break-inside-avoid">
              <h2 className="text-xl font-normal uppercase text-center mb-4 tracking-widest">
                Мови
              </h2>
              <hr className="border-t-[0.5px] border-black mb-6 w-full" />
              <div className="flex flex-col items-center gap-2 text-base">
                {languages.map((lang: any, index: number) => (
                  <div key={index}>
                    <span className="font-bold">{lang.name || "Мова"}</span>
                    {lang.level && <span className="italic text-gray-700"> — {lang.level}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ResumePreview({ resume }: { resume: Resume }) {
  const experience = resume.experience as any[] || [];
  const education = resume.education as any[] || [];
  const skills = resume.skills || [];
  const languages = resume.languages as any[] || [];
  const template = (resume as any).template || "standard";

  const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
  const totalExpMonths = experience.reduce((acc, exp) => acc + getExperienceDurationInMonths(exp), 0);

  const props = { resume, experience, education, skills, languages, fullName, totalExpMonths };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}} />
      {template === "modern" && <ModernTemplate {...props} />}
      {template === "elegant" && <ElegantTemplate {...props} />}
      {template !== "modern" && template !== "elegant" && <StandardTemplate {...props} />}
    </>
  );
}
