---
layout: default
title: Calendar
---

{% comment %} Starting from the first date of instruction, find Sunday {% endcomment %}
{% assign startdateseconds = site.data.calendar.dates_of_instruction.start | append: 'Z' | date: '%s' %}
{% assign startdayofweek = startdateseconds | date: '%w' %}
{% assign startdayoffset = startdayofweek | times: 86400 %}
{% assign startdateseconds = startdateseconds | minus: startdayoffset %}
{% assign startdate = startdateseconds | date: '%F' %}
{% assign startdayofweek = nil %}
{% assign startdayoffset = nil %}

{% comment %} Starting from the last date of instruction, find Saturday {% endcomment %}
{% assign enddateseconds = site.data.calendar.dates_of_instruction.end | append: 'Z' | date: '%s' %}
{% assign enddayofweek = enddateseconds | date: '%w' %}
{% assign enddayoffset = 6 | minus: enddayofweek | times: 86400 %}
{% assign enddateseconds = enddateseconds | plus: enddayoffset %}
{% assign enddate = enddateseconds | date: '%F' %}
{% assign enddayofweek = nil %}
{% assign enddayoffset = nil %}

{% comment %} How many days are in our calendar {% endcomment %}
{% assign numdays = enddateseconds | minus: startdateseconds | divided_by: 86400 %}

<table class="calendar table table-bordered">
  {% for currentdaynum in (0..numdays) %}
    {% assign currentdateseconds = currentdaynum | times: 86400 | plus: startdateseconds %}
    {% assign currentdate = currentdateseconds | date: '%F' %}
    {% assign currentdayofweek = currentdate | date: '%a' %}

    {% case currentdayofweek %}
    {% when 'Sun' %}
    <tr>
    {% when 'Mon' or 'Tue' or 'Wed' or 'Thu' or 'Fri' %}
    <td width="20%">
      {{ currentdate | date: '%b %-d'}}<br>
      
      <table width="100%">
        {% for currentholiday in site.data.calendar.holidays %}
          {% if currentdate == currentholiday.date %}
            <tr class="holiday">
              <td>
                {{ currentholiday.name }}
              </td>
            </tr>
          {% endif %}
        {% endfor %}
        
        {% for currentaway in site.data.calendar.aways %}
          {% if currentdate == currentaway.date %}
            <tr class="away table-condensed">
              <td>
                {{ currentaway.name }}
              </td>
            </tr>
          {% endif %}
        {% endfor %}

        {% for currentlecture in site.data.calendar.lectures %}
          {% if currentdate == currentlecture.date %}
            {% assign currentlecturetime = currentlecture.time %}
            {% if currentlecturetime == nil %}
              {% assign currentlecturetime = site.data.calendar.lecture.time %}
            {% endif %}
            {% assign currentlecturelocation = currentlecture.location %}
            {% if currentlecturelocation == nil %}
              {% assign currentlecturelocation = site.data.calendar.lecture.location %}
            {% endif %}
  
            <tr class="lecture">
              <td>
                Lecture<br>
                <small>
                  {{ currentlecturetime }}<br>
                  {{ currentlecturelocation }}<br>
                </small>
              </td>
            </tr>
            {% if currentlecture.name != nil %}
              <tr class="lecture">
                <td colspan="2">
                  {{ currentlecture.name }}<br>
                </td>
              </tr>
            {% endif %}
          {% endif %}
        {% endfor %}
  
        {% for currentsection in site.data.calendar.sections %}
          {% if currentdate == currentsection.date %}
            {% assign currentsectionschedule = currentsection.schedule %}
            {% if currentsectionschedule == nil %}
              {% assign currentsectionschedule = site.data.calendar.section.schedule %}
            {% endif %}
  
            <tr class="section">
              <td>
                Section<br>                
                <small>
                  {% for currentsectionscheduleitem in currentsectionschedule %}
                    {{ currentsectionscheduleitem.time }}<br>
                    {{ currentsectionscheduleitem.location }}<br> 
                  {% endfor %}
                </small>
              </td>
            </tr>
            {% if currentsection.name != nil %}
              <tr class="section">
                <td colspan="2">
                  {{ currentsection.name }}<br>
                </td>
              </tr>
            {% endif %}
          {% endif %}
        {% endfor %}
  
        {% for currentexam in site.data.calendar.exams %}
          {% if currentdate == currentexam.date %}
            <tr class="exam">
              <td>
                {{ currentexam.name }}<br>
              </td>
            </tr>
          {% endif %}
        {% endfor %}
  
        {% for currentpresentation in site.data.calendar.presentations %}
          {% if currentdate == currentpresentation.date %}
            <tr class="presentation">
              <td>
                {{ currentpresentation.name }}<br>
              </td>
            </tr>
          {% endif %}
        {% endfor %}
  
        {% for currentassignment in site.data.calendar.assignments %}
          {% if currentdate == currentassignment.date %}
            <tr class="assignment">
              <td>
                {{ currentassignment.name }}<br>
              </td>
            </tr>
          {% endif %}
        {% endfor %}
  
        {% for currentmilestone in site.data.calendar.milestones %}
          {% if currentdate == currentmilestone.date %}
            <tr class="milestone">
              <td>
                {{ currentmilestone.name }}<br>
              </td>
            </tr>
          {% endif %}
        {% endfor %}
      </table>
    </td>
    {% when 'Sat' %}
    </tr>
    {% endcase %}  
  {% endfor %}
</table>
