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
            <tr class="holiday table-condensed">
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
                <small>
                  {{ currentaway.name }}
                </small>
              </td>
            </tr>
          {% endif %}
        {% endfor %}       
        
        {% for currentlecture in site.data.calendar.lectures %}
          {% if currentdate == currentlecture.date %}
            {% assign currentlocation = currentlecture.location %}
            {% if currentlocation == nil %}
              {% assign currentlocation = "lectures" %}
            {% endif %}
  
            <tr class="lecture">
              <td>
                {% if currentlecture.name != nil %}
                  {{ currentlecture.name }}<br>
                {% else %}   
                  Lecture<br>
                {% endif %}
                <small>
                  {% for currentlocationitem in site.data.calendar.locations[currentlocation] %}
                      {{ currentlocationitem.time }}<br>
                      {{ currentlocationitem.location }}<br>
                  {% endfor %}
                </small>
              </td>
            </tr>
          {% endif %}
        {% endfor %}
  
        {% for currentsection in site.data.calendar.sections %}
          {% if currentdate == currentsection.date %}
            {% assign currentlocation = currentlecture.location %}
            {% if currentlocation == nil %}
              {% assign currentlocation = "sections" %}
            {% endif %}
  
            <tr class="section">
              <td>
                Section<br>                
                <small>
                  {% for currentlocationitem in site.data.calendar.locations[currentlocation] %}
                      {{ currentlocationitem.time }}<br>
                      {{ currentlocationitem.location }}<br>
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

        {% for currentmajor in site.data.calendar.majors %}
          {% if currentdate == currentmajor.date %}
            {% assign currentlocation = currentmajor.location %}
            <tr class="major">
              <td>
                {{ currentmajor.name }}<br>
                <small>
                  {% for currentlocationitem in site.data.calendar.locations[currentlocation] %}
                      {{ currentlocationitem.time }}<br>
                      {{ currentlocationitem.location }}<br>
                  {% endfor %}
                </small>
              </td>
            </tr>
          {% endif %}
        {% endfor %}
        
        {% for currentassignment in site.data.calendar.assignments %}
          {% if currentdate == currentassignment.date %}
            <tr class="assignment">
              <td>
                <small>
                  {% if currentassignment.link != nil %}<a href="{{ site.baseurl }}/{{ currentassignment.link }}">{% endif %}
                  {{ currentassignment.name }}<br>
                  {% if currentassignment.link != nil %}</a>{% endif %}
                </small>
              </td>
            </tr>
          {% endif %}
        {% endfor %}

        {% for currentofficehour in site.data.calendar.officehours %}
          {% if currentdate == currentofficehour.date %}
            {% assign currentlocation = currentofficehour.location %}
            <tr class="officehour">
              <td>
                {{ currentofficehour.name }}<br>
                <small>
                  {% for currentlocationitem in site.data.calendar.locations[currentlocation] %}
                      {{ currentlocationitem.time }}<br>
                      {{ currentlocationitem.location }}<br>
                  {% endfor %}
                </small>
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
